/**
 * @prettier
 */

import { getDisplayedTypeName, getSpriteOverrideForDisplayName } from "./showdownMetadataUtil";

const BASE_SPRITE_URL =
    process.env.NODE_ENV === "production"
        ? `${window.location.origin}/sprites`
        : process.env.REACT_APP_SPRITE_URL;

export function getPokemonSpriteUrl(displayName: string, generation: Common.Generation): string {
    const spriteOverride = getSpriteOverrideForDisplayName(displayName);
    if (spriteOverride) {
        return `${BASE_SPRITE_URL}/${spriteOverride}`;
    } else if (generation <= "6") {
        return `${BASE_SPRITE_URL}/gen${generation}/${getPokemonFileName(displayName)}`;
    } else {
        return `${BASE_SPRITE_URL}/dex/${getPokemonFileName(displayName)}`;
    }
}

function getPokemonFileName(displayName: string) {
    const normalizedName = displayName.toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");
    return `${normalizedName}.png`;
}

export function getItemSpriteUrl(displayName: string): string {
    const normalizedName = displayName
        .toLowerCase()
        .replace(" ", "-")
        .replace(/[^a-zA-Z0-9-]/g, "");

    return `${BASE_SPRITE_URL}/itemicons/${normalizedName}.png`;
}

export function getTypeLabelSpriteUrl(typeName: string): string {
    const displayedTypeName = getDisplayedTypeName(typeName);
    const normalizedName =
        displayedTypeName.charAt(0).toUpperCase() + displayedTypeName.substring(1);
    return `${BASE_SPRITE_URL}/types/${normalizedName}.png`;
}

export function getMoveEffectTypeSpriteUrl(effectType: Common.MoveEffectType): string {
    return `${BASE_SPRITE_URL}/categories/${effectType}.png`;
}
