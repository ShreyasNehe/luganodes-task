#!/bin/bash

# Wait for Grafana to start
sleep 10

# Set up the Telegram notification channel using Grafana API
curl -X POST http://admin:${GF_SECURITY_ADMIN_PASSWORD}@localhost:3000/api/alert-notifications \
-H "Content-Type: application/json" \
-d '{
      "name": "Telegram",
      "type": "telegram",
      "settings": {
        "botToken": "'"${TELEGRAM_BOT_TOKEN}"'",
        "chatId": "'"${TELEGRAM_CHAT_ID}"'",
        "parseMode": "HTML"
      },
      "isDefault": true
    }'
