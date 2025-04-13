// Тестовый объект №4 – строки с большим количеством повторов
export const repetitiveStringObject = {
	messages: Array.from({ length: 1000 }, () => new TextDecoder().decode(crypto.getRandomValues(new Int8Array(1000)))),
};
