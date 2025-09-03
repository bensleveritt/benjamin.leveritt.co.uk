import type { PageServerLoad } from './$types';

const sentences = [
	'Optimistic futurist.',
	'Budding essayist.',
	'Digital craftsman.',
	'Systems thinker.',
	'Curious explorer.',
	'Problem solver.',
	'Design advocate.',
	'State machinist.',
	'Technology enthusiast.',
	'Creative technologist.',
	'Future-focused maker.',
	'Thought thinker.',
	'User experience designer.',
	'Innovation catalyst.',
	'Lifelong learner.',
	'Code architect.',
	'Strategic designer.',
	'Tech optimist.',
	'Human-centered creator.'
	// 'Cargo cyclist.',
	// 'Father.',
	// 'AI evangelist.',
	// 'Environmentalist.'
];

function getRandomSentences(count: number): string[] {
	const shuffled = [...sentences].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

export const load: PageServerLoad = () => {
	const additionalSentences = getRandomSentences(2);
	const allSentences = ['Design engineer.', ...additionalSentences];
	const subtitle = allSentences.join('<br /> ');

	return {
		subtitle
	};
};
