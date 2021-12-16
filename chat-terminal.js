/**
Inspired By Roll20 Fallout Terminal by Cazra
https://github.com/Cazra/roll20-api-scripts

This is a modified version optimized to work with the FoundyVtt system by HappySteve
*/


class ChatTerminal {

    static MODULE_NAME = "module.chat-terminal";
    // OPERATIONS:
    static TRY_PASSWORD = "tryPassword";
    static SHOW_SCREN = "showScreen";
    static BACK = "back";
    static PREV = "prev";
    static CLOSE = "close";

    // CHAT COMANDS
    static ACTIVATE_TERMINAL_CMD = '!_activate_terminal';
    static PASSWORD_CMD = '!pass';
    static PREV_SCREEN_CMD = '!_prev_screen';
    static SHOW_SCREEN_CMD = '!_show_screen';

    //UTILS
    static ASCII_TABLE = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`{|}~';
    static DEFAULT_BG_COLOR = '#000';
    static DEFAULT_BUTTON_COLOR = '#114422';
    static DEFAULT_TEXT_COLOR = '#22ff88';


    constructor() {
        if (ChatTerminal._instance) {
            throw new Error("ChatTerminal already has an instance!!!");
        }
        ChatTerminal._instance = this;
        this.curTerminal = {};
        this.nextItemId = 0;
        this.history = [];
        this.curScreenId;
        this.latestMsgId;
    }

    /** 
    HANDLE SOCKET CALLS
    */
    handleTryPassword(data) {
        const args = data.content.split(' ');
        const password = args.slice(1).join(' ');
        if (password === this.curTerminal._password)
            this.curTerminal._locked = false;
        else
            this.curTerminal._attempts--;

        this._displayScreen(this.curTerminal._startId);
    }

    handleShowScreen(data) {
        this.history.push(this.curScreenId);
        this._displayScreen(data.id);
    }

    handleGoBack(data) {
        const id = this.history.pop();
        this._displayScreen(id);
    }

    /**
   * Activates a terminal by initializing its JSON and displaying the
   * first screen of the terminal.
   * @private
   * @param  {string} id
   */
    activateTerminal(_journalName) {
        this.curTerminal = {};
        this.nextItemId = 0;
        this.history = [];
        this.curScreenId;

        var json = this._getTerminalJson(_journalName);
        if (json) {
            this._initTerminal(json);
            this._displayScreen(this.curTerminal._startId);
        }
    }

    /**
  * Parses a terminal's raw JSON from Journal Entity content.
  * @private
  * @param  {string} _journalName
  */
    _getTerminalJson(_journalName) {
        //get the journal and the content
        var journal = game.journal.getName(_journalName);
        var text = $(journal.data.content).text();
        var _json = JSON.parse(text);
        return _json;
    }

    /**
     * Initializes the internal JSON for the terminal.
     * @private
     * @param  {Terminal} json
     */
    _initTerminal(json) {
        // Recursively create a map of each item in the terminal.
        this.curTerminal = {};
        this.nextItemId = 0;
        this.history = [];

        this._initTerminalScreens(json);

        $.extend(this.curTerminal, {
            _locked: json.locked,
            _password: json.password,
            _attempts: json.attempts,
            _startId: json.id,
            _terminalName: json.name
        });
    }

    /**
     * Initializes the IDs for the terminal screens.
     * @private
     * @param  {TerminalScreen} screen
     */
    _initTerminalScreens(screen) {
        // Assign the item an ID if it doesn't already have one.
        if (!screen.id) {
            screen.id = this.nextItemId;
            this.nextItemId++;
        }
        this.curTerminal[screen.id] = screen;

        // Recursively create the child items' IDs.
        screen.screenIds = [];
        if (screen.screens != undefined) {
            var l = screen.screens.length;
            for (var i = 0; i < screen.screens.length; i++) {
                var child = screen.screens[i];

                if ((typeof child === "object" || typeof child === 'function') && (child !== null)) {
                    this._initTerminalScreens(child);
                    screen.screenIds.push(child.id);
                }
                else {
                    screen.screenIds.push(child);
                }
            }
        }
        delete screen.screens;
    }

    /**
     * Displays a terminal screen in the chat.
     * @private
     * @param  {(string|int)} id
     */
    _displayScreen(id) {
        const screen = this.curTerminal[id];
        this.curScreenId = id;

        var html = '<table style="background-color: ' + this._getBgColor() + '; border: solid 1px ' + this._getBgColor() + '; border-collapse: separate; border-radius: 10px; font-family: monospace; overflow: hidden; width: 100%;">';
        html += '<thead><tr><th style="color: ' + this._getTextColor() + '">' + this.curTerminal._terminalName + '</th></tr>';
        html += '</thead>';
        html += '<tbody>';
        html += '<tr><td style ="color: ' + this._getTextColor() + '; padding: 0.5em;">';
        if (screen) {
            html += this._displayScreenContent(screen);
        }
        else {
            html += this._displayScreenContent('ERROR 0xFFFFF710\n"Data Corru:xsfkleg,, g364[735}3__' + id + '."');
        }

        if (!this.curTerminal._locked) {
            html += this._displayScreenButtons(screen);
        }

        html += '</td></tr></tbody></table>';
        this._sendChat('Fallout Terminal', html);

    }

    /**
     * Displays a command button for the terminal screen.
     * @param  {string} cmd
     * @param  {string} label
     * @return {string}
     */
    _displayScreenButton(cmd, label, id) {
        return '<button style="background: ' + this._getBgColor() + '; color: ' + this._getTextColor() + '; border: none; margin-bottom:0.2em;" class="terminal-chat-button" data-label="' + label + '" data-screenid="' + id + '">' + label + '</button>'
    }
    _displayBackButton() {
        return '<button class="terminal-back-button" style="background: ' + this._getBgColor() + '; color: ' + this._getTextColor() + '; border: none; margin-bottom:0.2em;">BACK</button>';
    }

    /**
     * Displays the navigation buttons for the screen.
     * @param  {TerminalScreen} screen
     */
    _displayScreenButtons(screen) {
        var prevScreenId = this.history[this.history.length - 1];

        var html = '<div style="padding-top: 1em;" class="flexcol">';
        if (screen) {
            for (var i = 0; i < screen.screenIds.length; i++) {
                var id = screen.screenIds[i];
                var _screen = this.curTerminal[id];
                if (_screen) {
                    html += this._displayScreenButton(ChatTerminal.SHOW_SCREEN_CMD + ' ' + id, _screen.name, id);
                }
            }
        }
        if (prevScreenId !== undefined) {
            html += this._displayBackButton();
        }
        html += '</div>';
        return html;
    }

    /**
     * Produce the HTML content for a terminal screen.
     * @private
     * @param  {TerminalScreen} screen
     * @return {string}
     */
    _displayScreenContent(screen) {
        var html = '<div>';
        if (typeof screen === "string") {
            html += this._htmlNewlines(screen);
        }
        else if (this.curTerminal._locked) {
            //if(!screen.attempts){
            if (screen.attempts < 1) {
                html += this._htmlNewlines('TERMINAL LOCKED\n\nPLEASE CONTACT AN ADMINISTRATOR');
            }
            else {
                html += this._htmlNewlines(this._displayScreenHacking());
            }
        }
        else {
            html += this._htmlNewlines(screen.name + '\n\n' + (screen.content || ''));
        }
        html += '</div>';
        return html;
    }

    _displayScreenHacking() {
        var attempts = this.curTerminal._attempts;

        if (attempts < 1) {
            return 'TERMINAL LOCKED\n\nPLEASE CONTACT AN ADMINISTRATOR';
        }
        else {
            var html = attempts + ' ATTEMPT(S) LEFT: \n';
            html += '\n\n';
            for (var n = 0; n < attempts; ++n) {
                html += '&#9608; ';
            }

            // Display a fake RAM dump.
            var startAddr = 0xf000 + Math.floor(Math.random() * 0xf0f);
            var inc = 10;
            for (var r = 0; r < 16; r++) {
                var addr = startAddr + inc * i;
                html += '0x' + addr.toString(16).toUpperCase() + ' ';
                for (var i = 0; i < inc; i++) {
                    html += ChatTerminal.ASCII_TABLE[Math.floor(Math.random() * ChatTerminal.ASCII_TABLE.length)].replace('<', '&lt;').replace('>', '&gt;');
                }
            }
            html += '\n\n';

            html += 'ENTER PASSWORD by typing \"!pass [password]\"'
            return html;
        }
    }
    /**
     * Guesses the password for the terminal. Moved to socket handler
     * @param  {string} password
     */
    // _guessPassword(password) {
    //     if (password === this.curTerminal._password)
    //         this.curTerminal._locked = false;
    //     else
    //         this.curTerminal._attempts--;
    //     this._displayScreen(this.curTerminal._startId);
    // }

    /**
     * Replaces \n's with <br/>'s.
     * @param  {string} str
     * @return {string}
     */
    _htmlNewlines(str) {
        return str.replace(/\n/g, '<br/>');
    }

    async _sendChat(name, content) {
        await ChatMessage.create({ content: content, flags: { terminalMsg: true } });
    }

    /**
     * Handle button clicks
     * @param {html} $el
     */
    _onTerminalButtonScreen($el) {
        const id = $el.currentTarget.dataset.screenid;
        if (game.user.isGM) {
            this.handleShowScreen({ id: id });
        } else {
            game.socket.emit(ChatTerminal.MODULE_NAME, {
                operation: ChatTerminal.SHOW_SCREN,
                id: id
            })
        }
    }
    _onTerminalButtonBack($el) {
        if (game.user.isGM) {
            this.handleGoBack();
        } else {
            game.socket.emit(ChatTerminal.MODULE_NAME, {
                operation: ChatTerminal.BACK,
            })
        }
    }

    /**
     * Do this on Render Chat Message
     * see if it is a terminal message, delete old one and assign button clicks
     * commented are roll20 left overs of commnads.I'll need to implement those
     * @param {schat message} msg 
     * @param {html} html 
     * @param {full msg data} data 
     * @returns 
     */
    async _checkChatMessage(msg, html, data) {
        if (!data.message.flags.terminalMsg)
            return;

        if (game.user.isGM) {
            let oldMsg = await game.messages.get(this.latestMsgId);
            if (oldMsg) {
                await oldMsg.delete()
            }
        }
        this.latestMsgId = data.message._id;
        $(html).find(".terminal-chat-button").click({ _html: html }, this._onTerminalButtonScreen.bind(this));
        $(html).find(".terminal-back-button").click({ _html: html }, this._onTerminalButtonBack.bind(this));
        //try {
        // if(msg.content === ChatTerminal.ACTIVATE_TERMINAL_CMD && msg.selected) {
        //   this._activateTerminal(msg.selected[0]._id);
        // }
        // if(msg.content.indexOf(ChatTerminal.SHOW_SCREEN_CMD) === 0) {
        //   var args = msg.content.split(' ');
        //   var id = args[1];
        //   this.history.push(this.curScreenId);
        //   this._displayScreen(args[1]);
        // }
        // if(msg.content.indexOf(ChatTerminal.PREV_SCREEN_CMD) === 0) {
        //   var id = this.history.pop();
        //   this._displayScreen(id);
        // }
        // if(msg.content.indexOf(ChatTerminal.PASSWORD_CMD) === 0) {
        //   var args = msg.content.split(' ');
        //   var password = args.slice(1).join(' ');
        //   this._guessPassword(password);
        // }
        // }
        // catch(err) {
        //   console.log('FALLOT TERMINAL ERROR: ' + err.message);
        // }
    }

    // HELPERS
    _getButtonColor() {
        return ChatTerminal.DEFAULT_BUTTON_COLOR;
    }
    _getTextColor() {
        return ChatTerminal.DEFAULT_TEXT_COLOR;
    }
    _getBgColor() {
        return ChatTerminal.DEFAULT_BG_COLOR;
    }
}


/**
 * HOOKS
 */
Hooks.once("ready", () => {
    console.log('INIT CHAT TERMINAL')
    if (ChatTerminal._instance) return;
    const falloutTerminal = new ChatTerminal();
    game.falloutTerminal = falloutTerminal;
    if (game.user.isGM) {
        game.socket.on(`module.chat-terminal`, (data) => {
            if (data.operation === ChatTerminal.TRY_PASSWORD) ChatTerminal._instance.handleTryPassword(data);
            if (data.operation === ChatTerminal.SHOW_SCREN) ChatTerminal._instance.handleShowScreen(data);
            if (data.operation === ChatTerminal.BACK) ChatTerminal._instance.handleGoBack(data);
        });
    }

    Hooks.on('renderChatMessage', (message, html, data) => {
        if (message.data.flags.terminalMsg) {
            falloutTerminal._checkChatMessage(message.data, html, data);
        }
    });

    // CHECK PASSWORD IN PRE CREATE
    // Send through the socket if user is player.
    Hooks.on('preCreateChatMessage', (msg, content) => {
        if (msg.data.content.indexOf(ChatTerminal.PASSWORD_CMD) === 0) {
            const _data = {
                operation: ChatTerminal.TRY_PASSWORD,
                user: game.user.id,
                content: msg.data.content
            }
            if (!game.user.isGM) {
                game.socket.emit(ChatTerminal.MODULE_NAME, _data);
            } else {
                ChatTerminal._instance.handleTryPassword(_data);
            }
            // dont print actual chat message (return false)
            return false;
        }
    });
});