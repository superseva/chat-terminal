# Chat Terminal (Fallout Style)

Inspired By Roll20 Fallout Terminal by Cazra
https://github.com/Cazra/roll20-api-scripts

## HOW TO:
Use the links bellow to copy the example JSON file content and paste it in to your Journal Page. (clear the styling, or paste directly in to the html editor part)

## Terminal Macro
GM should create a **script** macro that activates the terminal with a specific journal entry:
``` game.chatTerminal.activateTerminal('Journal Name', 'Page Name') ```
After that everything is in displayed in the chat messages.


## Terminal Content Examples : 

### A simple example and the terminal is protected by a password. Type "!pass fo" in the chat once you triggered the Terminal Macro and you see the welcome screen in chat.
Simple example of JSON with the password (password = fo): https://raw.githubusercontent.com/superseva/chat-terminal/master/example.json

### this is a longer entry [not password protected]
Longer example: https://raw.githubusercontent.com/Roll20/roll20-api-scripts/master/FalloutTerminal/example.json 

```
{
	"name": "Test Terminal",
	"locked": true,
	"password": "fo",
	"attempts": 3,
	"content": "Welcome to ROBCO Industries (TM) Termlink\nClearance: Test Terminal",
	"screens": [{
		"name": "SCREEN 1 TITLE",
		"content": "This is screen 1 content",
		"screens": [{
			"name": "SCREEN 1.1 SUBTITLE",
			"content": "This is screen 1.1 content, subsection of screen 1"
		}]
	}, {
		"name": "SCREN 2 TITLE",
		"content": "This is screen 2 content"
	}, {
		"name": "SCREEN 3 TITLE",
		"content": "This is screen 3 content"
	}]
}
```

### You can set the passwords and how many unlock attempts there are in the json's root
```
"password": "somepass",
"attempts": 3,
```

![home screen]('https://github.com/superseva/chat-terminal/blob/61029a89f5cf11d08626e425cf617b0f2495edbe/Foundry_Virtual_Tabletop_DkaNcDgmar.png')
