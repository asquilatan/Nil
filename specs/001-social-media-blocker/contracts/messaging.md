# Internal Messaging Contract

**Feature**: 001-social-media-blocker
**Type**: Chrome Runtime Messages (Background <-> Content)

## 1. URL Change Notification
**Sender**: Background Script
**Receiver**: Content Script
**Trigger**: `chrome.webNavigation.onHistoryStateUpdated`

**Request Object**:
```json
{
  "type": "URL_CHANGED",
  "payload": {
    "url": "https://www.youtube.com/watch?v=123",
    "tabId": 123
  }
}
```

**Response**: None (Fire and forget).

## 2. Ping / Status Check (Optional Debugging)
**Sender**: Popup
**Receiver**: Content Script
**Trigger**: User opens popup

**Request Object**:
```json
{
  "type": "GET_STATUS"
}
```

**Response Object**:
```json
{
  "status": "active",
  "platform": "youtube",
  "blockedElements": 5
}
```
