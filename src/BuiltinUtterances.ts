// Holder class for utterances for builtin intents
// This could have been done as just a JSON file, but then requires build tool to include it in the lib dir
export class BuiltinUtterances {
    public static values(): {[id: string]: string[]} {
        return values;
    }
}

const values: any = {
    "Default Welcome Intent": [],
    "Default Fallback Intent": [
        "I didn\u0027t get that. Can you say it again?",
        "I missed what you said. Say it again?",
        "Sorry, could you say that again?",
        "Sorry, can you say that again?",
        "Can you say that again?",
        "Sorry, I didn\u0027t get that.",
        "Sorry, what was that?",
        "One more time?",
        "What was that?",
        "Say that again?",
        "I didn\u0027t get that.",
        "I missed that."
    ]
};
