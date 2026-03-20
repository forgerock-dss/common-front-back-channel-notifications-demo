# Simple Back Channel Notification

Sample **PingOne Advanced Identity Cloud (P1AIC)** journeys demonstrating back channel journeys providing **notifications** to the front channel journey. 

---

## Setup Overview

To deploy this sample implementation, complete the following steps:

1. Create a user called demo
2. Import the custom nodes  
3. Import the journeys  
4. Test the implementation  

---

## Create a user

In this section, you will create a PingOne environment with **PingOne Verify** enabled.

1. Create a user in P1AIC called `demo`. Be sure to set a strong password as they username is common in the P1AIC documentation.

---

## Import Custom Nodes

1. Download the Custom Nodes JSON file:  
   [Custom-Nodes.json](custom_nodes/Custom-Nodes.json)
2. In the P1AIC Admin UI, navigate to **Journeys → Custom Nodes**.
3. Select **Import Nodes**, browse to the JSON file, and complete the import.

The following four Custom Nodes will be imported:

| Node | Purpose |
|-----|---------|
| Display Node State Variables | Display variable from nodeState on-screen |
| Set Front Channel Status | Sets the status which the front channel can read and display as the back channel journey progresses |
| Set Shared Or Transient State | Sets variables in state |
| User Message to Display | Displays configurable messages to the user |

---

## Import Journeys

1. Download the journey export file:  
   [journeyExport.json](journey_exports/journeyExport.json)
2. In the P1AIC Admin UI, navigate to **Journeys → Journeys → Import**.
3. Upload the JSON file and complete the import.

The following journeys will be created:

| Journey | Purpose |
|--------|---------|
| simpleFrontChannel | Front-channel sample journey |
| simpleBackChannel | Back-channel sample journey which updates state |

### Journey Diagrams

**Front-Channel Helpdesk Journey**

![Helpdesk Front Channel](images/ront_channel.png?raw=true)

**Back-Channel Customer Journey**

![Customer Back Channel](images/back_channel.png?raw=true)


## Testing

1. Ensure a user with the username of demo exists.
2. Launch the sample front channel journey:
   ```text
   https://openam-<tenant>/am/XUI/?realm=alpha&authIndexType=service&authIndexValue=simpleFrontChannel
   ```
3. Follow the instructions onscreen.

---
