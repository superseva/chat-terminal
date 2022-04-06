# Chat Terminal (Fallout Style)

Inspired By Roll20 Fallout Terminal by Cazra
https://github.com/Cazra/roll20-api-scripts

Copy JSON file content and paste it in to the HTML section of a Journal
(the <> button in the Journal edit toolbar)

Simple example of JSON with the password (password = fo): https://raw.githubusercontent.com/superseva/chat-terminal/master/example.json

Complicated example: https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/FalloutTerminal/example.json 

GM should create a **script** macro that activates the terminal with a specific journal entry:
``` game.chatTerminal.activateTerminal('Journal Name here') ```

If the terminal is password protected players need to type "!pass exact-password" in the chat to unlock the terminal and continue to read the entries


