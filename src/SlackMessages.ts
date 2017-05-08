// Waiting on rug release that includes Presentable.id
// import { Presentable } from "@atomist/rug/operations/Handlers";

/**
 * Construct and render slack messages according to Slack message
 * formatting: https://api.slack.com/docs/message-formatting. Customize
 * messages with rug actions.
 */

/**
 * Escapes special Slack characters.
 */
export function escape(text: string): string {
    if (text && text !== "") {
        return text
            .replace(/&/, "&amp;")
            .replace(/</, "&lt;")
            .replace(/>/, "&gt;");
    } else {
        return text;
    }
}

/**
 * Constructs slack link.
 * Label is automatically escaped.
 */
export function url(fullUrl: string, label?: string) {
    if (label && label !== "") {
        return `<${fullUrl}|${escape(label)}>`;
    } else {
        return `<${fullUrl}>`;
    }
}

function emptyString(str: string) {
    return !str || str === "";
}

/**
 * Mentions user (e.g. @anna).
 * When userName is provided will add readable user name.
 */
export function atUser(userId: string, userName?: string) {
    if (!emptyString(userName)) {
        return `<@${userId}|${userName}>`;
    } else {
        return `<@${userId}>`;
    }
}

/**
 * Mentions channel (e.g. #general).
 * When both userId and channelName are omitted will render @channel.
 * Otherwise will mention specific channel by channelId.
 * When channelName is provided will add readable channel name.
 */
export function atChannel(channelId?: string, channelName?: string) {
    if (emptyString(channelId) && emptyString(channelName)) {
        return "<!channel>";
    } else if (emptyString(channelName)) {
        return `<#${channelId}>`;
    } else {
        return `<#${channelId}|${channelName}>`;
    }
}

/** Mentions here (@here) */
export function atHere() {
    return "<!here>";
}

/** Mentions everyone (@everyone) */
export function atEveryone() {
    return "<!everyone>";
}

/** Renders JSON representation of slack message. */
export function render(message: SlackMessage, pretty: boolean = false): string {
    return JSON.stringify(message, (key, val) => {
        if (key.charAt(0) !== "_") {
            return val;
        } else {
            return undefined;
        }
    }, pretty ? 4 : 0);
}

/** Render emoji by name */
export function emoji(name: string) {
    return `:${name}:`;
}

/** Render bold text */
export function bold(text: string) {
    return `*${text}*`;
}

/** Render italic text */
export function italic(text: string) {
    return `_${text}_`;
}

/** Render strike-through text */
export function strikethrough(text: string) {
    return `~${text}~`;
}

/** Render single line code block */
export function codeLine(text: string) {
    return "`" + text + "`";
}

/** Render multiline code block */
export function codeBlock(text: string) {
    return "```" + text + "```";
}

/** Render bullet list item */
export function listItem(item: string) {
    return `• ${item}`;
}

/** Represents slack message object. */
export interface SlackMessage {
    text: string;
    attachments?: Attachment[];
}

/** Represent slack attachment. */
export interface Attachment {
    text: string;
    fallback: string;
    mrkdwn_in?: string[];
    color?: string;
    pretext?: string;
    author_name?: string;
    author_link?: string;
    title?: string;
    title_link?: string;
    fields?: Field[];
    image_url?: string;
    thumb_url?: string;
    footer?: string;
    footer_icon?: string;
    ts?: number;
    actions?: Action[];
}

/** Represents slack attachment field. */
export interface Field {
    title?: string;
    value?: string;
    short?: boolean;
}

/**
 * Represents Slack action.
 * Only button is currently supported.
 */
export interface Action {
    text: string;
    name?: string;
    type?: ActionType;
    value?: string;
    style?: string;
    confirm?: ActionConfirmation;
}

/** Represents Slack action confirmation. */
export interface ActionConfirmation {
    title: string;
    text: string;
    ok_text: string;
    dismiss_text: string;
}

type ActionType = "button";

/** Construct Slack button that will execute provided rug instruction. */
export function rugButtonFrom(action: Action, command: Presentable): Action {
    const button: Action = { text: action.text };
    for (const attr in action) {
        if (action.hasOwnProperty(attr)) {
            button[attr] = action[attr];
        }
    }
    button.type = "button";
    button.name = "rug";
    button.value = command.id;
    return button;
}

// These are just temporary stubs until we add dependency to rugs
export interface Instruction {
    kind: string;
    name: string;
    parameters?: {};
}

export interface Presentable {
    id: string;
    instruction: Instruction;
}