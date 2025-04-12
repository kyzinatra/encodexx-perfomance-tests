// Тестовый объект №3 – большой, числовые данные
export const largeNumericObject = {
	metrics: Array.from({ length: 3_000_000 }, () => ({
		xValue: Math.random() * 1000,
		yValue: Math.random() * 1000,
		zValue: Math.random() * 1000,
	})),
};
