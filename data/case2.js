// Тестовый объект №2 – средний размер, массив объектов
export const mediumObject = {
	users: Array.from({ length: 1000 }, (_, i) => ({
		userId: i,
		username: `this is my user interface, hello ${i}`,
		registeredAt: 2390153 + i * 1000,
	})),
};
