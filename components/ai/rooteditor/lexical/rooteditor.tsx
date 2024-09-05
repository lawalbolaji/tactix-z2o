import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

import { isValidUrl } from "./utils/url";
import { FloatingMenuPlugin } from "./plugins/FloatingMenu";
import { EditorHistoryStateContext, useEditorHistoryState } from "./context/EditorHistoryState";
import { cn } from "@/lib/utils";

export const EDITOR_NAMESPACE = "@tactix";
export const EDITOR_NODES = [AutoLinkNode, CodeNode, HeadingNode, LinkNode, ListNode, ListItemNode, QuoteNode];

type EditorProps = {
    className?: string;
};

export function RootEditor(props: EditorProps) {
    const content = typeof window !== "undefined" ? localStorage.getItem(EDITOR_NAMESPACE) : null;

    return (
        <div
            id="editor-wrapper"
            className={cn(
                props.className,
                "relative prose max-w-full prose-slate prose-p:my-0 prose-headings:mb-4 prose-headings:mt-2 z-10 bg-transparent"
            )}
        >
            <EditorHistoryStateContext>
                <LexicalEditor />
            </EditorHistoryStateContext>
        </div>
    );
}

export function LexicalEditor() {
    const { historyState } = useEditorHistoryState();

    return (
        <>
            {/* Official Plugins */}
            <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<Placeholder />}
                ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin externalHistoryState={historyState} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ListPlugin />
            <LinkPlugin validateUrl={isValidUrl} />

            {/* Custom Plugins */}
            <FloatingMenuPlugin />
        </>
    );
}

const Placeholder = () => {
    return (
        <div className="absolute top-[1.125rem] left-[1.125rem] opacity-50 z-0">
            Start writing your job description here...
        </div>
    );
};
