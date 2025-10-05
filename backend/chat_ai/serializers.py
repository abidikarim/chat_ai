from rest_framework import serializers
from .models import ChatHistory, UserSummary

class ChatHistorySerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email')
    
    class Meta:
        model = ChatHistory
        fields = ['id', 'user', 'user_email', 'message', 'ai_response', 'language', 'model_used', 'created_at']
        read_only_fields = ['ai_response', 'created_at']  

class UserSummarySerializer(serializers.ModelSerializer):
    user_email = serializers.ReadOnlyField(source='user.email') 

    class Meta:
        model = UserSummary
        fields = ['id', 'user', 'user_email', 'language', 'summary_text', 'updated_at']
        read_only_fields = ['summary_text', 'updated_at']
