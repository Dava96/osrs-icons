import React from 'react';
import {
    spyglass,
    hammerIcon,
    present,
    scrapPaper,
    flippers,
    toDataUrl,
} from '@dava96/osrs-icons';

/** Available OSRS navigation icons mapped by purpose. */
const NAV_ICONS = {
    search: spyglass,
    packs: present,
    builder: hammerIcon,
    code: scrapPaper,
    flip: flippers,
} as const;

export type NavIconName = keyof typeof NAV_ICONS;

interface OsrsNavIconProps {
    name: NavIconName;
    size?: number;
    className?: string;
}

/**
 * Renders an OSRS icon as a small inline image.
 * Used throughout the site for navigation and section headers,
 * replacing generic lucide-react icons with thematic OSRS sprites.
 */
export const OsrsNavIcon: React.FC<OsrsNavIconProps> = ({
    name,
    size = 20,
    className,
}) => {
    const cursorValue = NAV_ICONS[name];
    const src = toDataUrl(cursorValue);

    return (
        <img
            src={src}
            alt={name}
            width={size}
            height={size}
            className={className}
            style={{ imageRendering: 'pixelated', verticalAlign: 'middle' }}
        />
    );
};
