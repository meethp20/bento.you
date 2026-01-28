import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InlineTextEditProps {
    initialValue: string;
    onSave: (value: string) => void;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
    isEditable?: boolean;
    multiline?: boolean;
}

export function InlineTextEdit({
    initialValue,
    onSave,
    className,
    as: Tag = 'span',
    isEditable = false,
    multiline = false
}: InlineTextEditProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setValue(initialValue);
            setIsEditing(false);
        }
    };

    const handleSave = () => {
        setIsEditing(false);
        if (value !== initialValue) {
            onSave(value);
        }
    };

    if (!isEditable) {
        return <Tag className={className}>{value}</Tag>;
    }

    if (isEditing) {
        if (multiline) {
            return (
                <textarea
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "bg-transparent border-none outline-none resize-none overflow-hidden ring-2 ring-indigo-500/50 rounded-lg px-1 -ml-1 w-full",
                        className
                    )}
                    rows={3}
                />
            );
        }
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={cn(
                    "bg-transparent border-none outline-none ring-2 ring-indigo-500/50 rounded-lg px-1 -ml-1 w-full",
                    className
                )}
            />
        );
    }

    return (
        <Tag
            onClick={() => setIsEditing(true)}
            className={cn(
                "cursor-text hover:bg-black/5 dark:hover:bg-white/10 rounded-lg px-1 -ml-1 transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10",
                className
            )}
        >
            {value}
        </Tag>
    );
}
