import threading
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from django.utils import timezone
from .models import ChatHistory, UserSummary, AIModel
from .serializers import ChatHistorySerializer, UserSummarySerializer
from .utils_ai import call_model_ai
import logging

logger = logging.getLogger(__name__)

class ChatMessageView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            model_used = request.query_params.get("model_used")
            language = request.query_params.get("language")

            chats = ChatHistory.objects.filter(user=user)
            if model_used:
                chats = chats.filter(model_used=model_used)
            if language:
                chats = chats.filter(language=language)

            chats = chats.order_by("-created_at")
            serializer = ChatHistorySerializer(chats, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.exception("Error in ChatMessageView.get")
            raise APIException(f"Failed to retrieve chat history: {str(e)}")

    def post(self, request):
        try:
            user = request.user
            message = request.data.get("message")
            language = request.data.get("language")
            model_used = request.data.get("model_used", AIModel.FALCON3)

            if not message:
                return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

            past_chats = ChatHistory.objects.filter(user=user, model_used=model_used).order_by("created_at")[:20]
            history = []
            for chat in past_chats: 
                history.append({"role": "user", "content": chat.message}) 
                history.append({"role": "assistant", "content": chat.ai_response})

            ai_response = call_model_ai(message, language, model_used, history)

            chat = ChatHistory.objects.create(
                user=user,
                message=message,
                ai_response=ai_response,
                language=language,
                model_used=model_used
            )

            serializer = ChatHistorySerializer(chat)
            response_data = serializer.data
            threading.Thread(target=self.update_user_summary, args=(user, language, model_used), daemon=True).start()

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.exception("Error in ChatMessageView.post")
            raise APIException(f"Failed to process chat message: {str(e)}")


    def update_user_summary(self, user, language, model_used):
        try:
            chats = ChatHistory.objects.filter(user=user, language=language).order_by("-created_at")[:3]
            messages_to_send = []

            if language.lower() == "ar":
                system_content = (
                    "أنت مساعد ذكي. صِف المستخدم بناءً على آخر أسئلته وأجوبة المساعد في جملة واحدة فقط، "
                    "ركز على اهتماماته أو استفساراته الشائعة، بدون أي تفاصيل إضافية أو أمثلة."
                )
                summary_prompt = "يرجى إنشاء ملخص قصير في جملة واحدة فقط يصف اهتمامات المستخدم بناءً على المحادثة السابقة."
            else:
                system_content = (
                    "You are a smart assistant. Describe the user based on their last questions and assistant replies "
                    "in ONE short sentence only, focusing on their interests or common queries, without extra details or examples."
                )
                summary_prompt = "Please generate a short one-line summary of the user's interests based on the above conversation."

            messages_to_send.append({"role": "system", "content": system_content})

            for c in reversed(chats):
                messages_to_send.append({"role": "user", "content": c.message})
                messages_to_send.append({"role": "assistant", "content": c.ai_response})

            messages_to_send.append({"role": "user", "content": summary_prompt})

            summary_text = call_model_ai(
                lang=language,
                selected_model=model_used,
                history=messages_to_send,
                isSummary=True
            )
        
            if not summary_text or not summary_text.strip():
                logger.warning(f"Skipping summary update — AI call failed or returned empty for user {user.email}")
                return 

            UserSummary.objects.update_or_create(
                user=user,
                language=language,
                defaults={"summary_text": summary_text, "updated_at": timezone.now()}
            )
    
        except Exception as e:
            logger.exception("Error in update_user_summary")
            raise APIException(f"Failed to update user summary: {str(e)}")


class UserSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            language = request.query_params.get("language", "en")

            summary = UserSummary.objects.get(user=user, language=language)
            serializer = UserSummarySerializer(summary)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except UserSummary.DoesNotExist:
            return Response(
                {"error": f"No summary found for language '{language}'."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.exception("Error in UserSummaryView.get")
            raise APIException(f"Failed to fetch user summary: {str(e)}")
