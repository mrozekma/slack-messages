import { Presentable } from "@atomist/rug/operations/Handlers";

/**
 * Construct and render slack messages according to Slack message
 * formatting: https://api.slack.com/docs/message-formatting. Customize
 * messages with rug actions.
 */

export function emptyString(str: string) {
    return !str || str === "" || str === undefined;
}

/**
 * Escapes special Slack characters.
 */
export function escape(text: string): string {
    if (!emptyString(text)) {
        return text
            .replace(/&/, "&amp;")
            .replace(/</, "&lt;")
            .replace(/>/, "&gt;");
    } else {
        return "";
    }
}

/**
 * Constructs slack link.
 * Label is automatically escaped.
 */
export function url(fullUrl: string, label?: string) {
    if (!emptyString(fullUrl) && !emptyString(label)) {
        return `<${fullUrl}|${escape(label)}>`;
    } else if (!emptyString(fullUrl)) {
        return `<${fullUrl}>`;
    } else {
        return "";
    }
}

/**
 * Mentions user (e.g. @anna).
 * When userName is provided will add readable user name.
 */
export function user(userId: string, userName?: string) {
    if (!emptyString(userId) && !emptyString(userName)) {
        return `<@${userId}|${userName}>`;
    } else if (!emptyString(userId)) {
        return `<@${userId}>`;
    } else {
        return "";
    }
}

/**
 * Mentions channel (e.g. #general).
 * Will mention specific channel by channelId.
 * When channelName is provided will add readable channel name.
 */
export function channel(channelId: string, channelName?: string) {
    if (!emptyString(channelId) && !emptyString(channelName)) {
        return `<#${channelId}|${channelName}>`;
    } else if (!emptyString(channelId)) {
        return `<#${channelId}>`;
    } else {
        return "";
    }
}

/** Mentions @channel */
export function atChannel() {
    return "<!channel>";
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
    return JSON.stringify(message, null, pretty ? 4 : 0);
}

/** Render emoji by name */
export function emoji(name: string) {
    return `:${name}:`;
}

/** Render bold text */
export function bold(text: string) {
    if (!emptyString(text)) {
        return `*${text}*`;
    } else {
        return "";
    }
}

/** Render italic text */
export function italic(text: string) {
    if (!emptyString(text)) {
        return `_${text}_`;
    } else {
        return "";
    }
}

/** Render strike-through text */
export function strikethrough(text: string) {
    if (!emptyString(text)) {
        return `~${text}~`;
    } else {
        return "";
    }
}

/** Render single line code block */
export function codeLine(text: string) {
    if (!emptyString(text)) {
        return "`" + text + "`";
    } else {
        return "";
    }
}

/** Render multiline code block */
export function codeBlock(text: string) {
    if (!emptyString(text)) {
        return "```" + text + "```";
    } else {
        return "";
    }
}

/** Render bullet list item */
export function listItem(item: string) {
    if (!emptyString(item)) {
        return `• ${item}`;
    } else {
        return "•";
    }
}

/** Represents slack message object. */
export interface SlackMessage {
    text?: string;
    attachments?: Attachment[];
}

/**
 * Represent slack attachment.
 * https://api.slack.com/docs/interactive-message-field-guide#attachment_fields
 */
export interface Attachment {
    text?: string;
    fallback: string;
    mrkdwn_in?: string[];
    color?: string;
    pretext?: string;
    author_name?: string;
    author_link?: string;
    author_icon?: string;
    title?: string;
    title_link?: string;
    fields?: Field[];
    image_url?: string;
    thumb_url?: string;
    footer?: string;
    footer_icon?: string;
    ts?: number;
    actions?: Action[];
    callback_id?: string;
    attachment_type?: string;
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
    name: string;
    type: ActionType;
    value?: string;
    style?: string;
    confirm?: ActionConfirmation;
}

/** Represents Slack action confirmation. */
export interface ActionConfirmation {
    title?: string;
    text: string;
    ok_text?: string;
    dismiss_text?: string;
}

export type ActionType = "button";

export interface ButtonSpec {
    text: string;
    style?: string;
    confirm?: ActionConfirmation;
}

/** Construct Slack button that will execute provided rug instruction. */
export function rugButtonFrom(action: ButtonSpec, command: Presentable<any>): Action {
    const button: Action = {
        text: action.text,
        type: "button",
        name: "rug",
        value: command.id,
    };
    for (const attr in action) {
        if (action.hasOwnProperty(attr)) {
            button[attr] = action[attr];
        }
    }
    return button;
}
