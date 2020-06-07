/**
 * @prettier
 */

declare namespace Common {
  type Generation = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8";

  type MoveEffectType = "Physical" | "Special" | "Status";
  type Move = {
    name: string;
    moveType: string;
    effectType: MoveEffectType;
    description: string;
    damage?: number,
    accuracy?: number,
    pp: number
  };

  type TypeEffectiveness = 0.25 | 0.5 | 0 | 1 | 2 | 4;

  type BaseStats = {
    atk: number;
    spa: number;
    def: number;
    spd: number;
    spe: number;
    hp: number;
  };

  type MoveWithOccurences = (Move & { occurences: number })

  type ItemOccurence = {
    itemDisplayName: string;
    description: string;
    occurences: number;
  };

  type AbilityOccurence = {
    abilityDisplayName: string;
    description: string;
    occurences: number;
  };

  type PokemonSummary = {
    displayName: string;
    type1: string;
    type2?: string;
    simulationResult: {
      moveOccurrences: MoveWithOccurences[];
      itemOccurences: ItemOccurence[];
      abilityOccurences: AbilityOccurence[];
      setsGenerated: number;
    };
    typeEffectiveness: Record<TypeEffectiveness, string[]>;
    baseStats: BaseStats;
  };

  type PokemonSummarySearchInputs = {
    pokemonName: string,
    generation: Common.Generation,
    isDoubles: boolean,
    isLead: boolean
  }

  type APIResponse<T> = {
    data: T;
    successful: boolean;
    errorMsg?: string;
  };
}
