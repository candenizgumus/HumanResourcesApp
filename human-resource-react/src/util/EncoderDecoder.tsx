class EncoderDecoder {
    // Long değerini Base64 formatında encode eden metod
    static encode(value: number): string {
        return btoa(value.toString());
    }

    // Base64 formatındaki string'i decode eden ve long değere çeviren metod
    static decode(encodedValue: string): number {
        const decodedString = atob(encodedValue);
        return parseInt(decodedString, 10);
    }

    // String değeri Base64 formatında encode eden metod
    static encodeString(value: string): string {
        return btoa(value);
    }

    // Base64 formatındaki string'i decode eden ve orijinal string'e çeviren metod
    static decodeString(encodedValue: string): string {
        return atob(encodedValue);
    }
}

export default EncoderDecoder;
