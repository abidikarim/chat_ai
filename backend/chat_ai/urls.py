from django.urls import path
from .views import ChatMessageView, UserSummaryView

urlpatterns = [
    path("chat/", ChatMessageView.as_view(), name="chat-message"),
    path("summary/", UserSummaryView.as_view(), name="user-summary")
]