// Тестовый объект №4 – строки с большим количеством повторов
export const repetitiveStringObject = {
	messages: Array.from({ length: 500 }, () => "Это повторяющаяся строка".repeat(200)),
};
