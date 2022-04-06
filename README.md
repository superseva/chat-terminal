# Chat Terminal (Fallout Style)

Inspired By Roll20 Fallout Terminal by Cazra
https://github.com/Cazra/roll20-api-scripts

## Install link: 

https://raw.githubusercontent.com/superseva/chat-terminal/master/module.json

## How It Works

1. Copy JSON file content and paste it in to the HTML section of a Journal
(the <> button in the Journal edit toolbar)

...Simple example of JSON with the password (password = fo): https://raw.githubusercontent.com/superseva/chat-terminal/master/example.json

...Complicated example: https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/FalloutTerminal/example.json 

2. GM should create a **script** macro that activates the terminal with a specific journal entry:
``` game.chatTerminal.activateTerminal('Journal Name here') ```

If the terminal is password protected players need to type "!pass exact-password" in the chat to unlock the terminal and continue to read the entries. You can navigate throught entries by clicking the buttons in the chat message.

![Terminal Started](https://github.com/superseva/chat-terminal/blob/db31d8214c63153a293096b81db2dc4ced62d1c4/Foundry_Virtual_Tabletop_DkaNcDgmar.png)

![Enter password](https://github.com/superseva/chat-terminal/blob/7ce80a2901ee439b9b8cfd3cd7dc194364ad3bb2/Foundry_Virtual_Tabletop_u4yKUq35t6.png)

![Home Screen](https://github.com/superseva/chat-terminal/blob/7ce80a2901ee439b9b8cfd3cd7dc194364ad3bb2/Foundry_Virtual_Tabletop_YImk0kVhPw.png)

![Subsection Screen](https://github.com/superseva/chat-terminal/blob/7ce80a2901ee439b9b8cfd3cd7dc194364ad3bb2/Foundry_Virtual_Tabletop_afLCvqxru2.png)

