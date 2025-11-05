<?php

namespace ms\Repositories;

use ms\Models\Exam;

class ExamRepository
{

	public function getExamData(int $examId): array
	{
		$exam = new Exam();
		$examId = apply_filters('wpml_object_id', $examId, 'exam', true);

		if (!$exam->load($examId)) {
			throw new \Exception('Exam not found');
		}

		$questions = $exam->getRelatedQuestions();
		$settings = $exam->getSettings();

		if (empty($questions)) {
			return [];
		}

		$examData = [];
		$currentId = 1;

		// Группируем вопросы по частям
		$questionsByParts = $this->groupQuestionsByParts($questions);
		foreach ($questionsByParts as $partNumber => $partQuestions) {
			// Добавляем preview для каждой части
			$examData[$currentId] = $this->createPreviewItem($currentId, $partNumber, $settings);
			$currentId++;

			// Добавляем intro для части
			$examData[$currentId] = $this->createExamIntroItem($currentId, $partNumber, $settings);
			$currentId++;

			// Группируем вопросы по типам
			$questionsByTypes = $this->groupQuestionsByTypes($partQuestions);

			foreach ($questionsByTypes as $questionType => $typeQuestions) {
				// Добавляем intro для типа вопросов
				$introItems = $this->createQuestionIntroItems($partNumber, $questionType, $settings);

				foreach ($introItems as $item) {
					$item['id'] = $currentId;
					$examData[$currentId] = $item;
					$currentId++;
				}


				// Добавляем вопросы
				$readingTextAdded = false;

				foreach ($typeQuestions as $question) {
					$questionItems = $this->createQuestionItem($currentId, $question, $partNumber, $questionType, $settings);

					// Если есть questionText — вставляем только один раз
					if (isset($questionItems['questionText']) && !$readingTextAdded) {
						$questionItems['questionText']['id'] = $currentId;
						$examData[$currentId] = $questionItems['questionText'];
						$currentId++;

						$readingTextAdded = true;
					}

					// questionTQ добавляется всегда
					$questionItems['questionTQ']['id'] = $currentId;
					$examData[$currentId] = $questionItems['questionTQ'];
					$currentId++;
				}

			}

			// Добавляем паузу между частями (кроме последней)
			if ($partNumber < count($questionsByParts)) {
				$examData[$currentId] = $this->createPauseItem($currentId, $partNumber, $settings);
				$currentId++;
			}
		}

		// Добавляем next ссылки
		$this->addNextLinks($examData);

		return $examData;
	}

	private function groupQuestionsByParts(array $questions): array
	{
		$grouped = [];

		foreach ($questions as $question) {
			$questionType = get_field('question_type', $question->ID);
			$part = $this->extractPartFromQuestionType($questionType);

			if (!isset($grouped[$part])) {
				$grouped[$part] = [];
			}

			$grouped[$part][] = $question;
		}

		ksort($grouped);

		return $grouped;
	}

	private function groupQuestionsByTypes(array $questions): array
	{
		$grouped = [];

		foreach ($questions as $question) {
			$questionType = get_field('question_type', $question->ID);

			if (!isset($grouped[$questionType])) {
				$grouped[$questionType] = [];
			}

			$grouped[$questionType][] = $question;
		}

		return $grouped;
	}

	private function createPreviewItem(int $id, int $partNumber, array $settings): array
	{
		$introImages = [
			1 => $settings['exam_intro_1'] ?? '',
			2 => $settings['exam_intro_2'] ?? '',
			3 => $settings['exam_intro_3'] ?? ''
		];

		return [
			'id' => $id,
			'type' => 'preview',
			'title' => "Exam Part {$partNumber}",
			'img' => $introImages[$partNumber] ?? ''
		];
	}

	private function createExamIntroItem(int $id, int $partNumber, array $settings): array
	{
		$introImages = [
			1 => $settings['exam_intro_1'] ?? '',
			2 => $settings['exam_intro_2'] ?? '',
			3 => $settings['exam_intro_3'] ?? ''
		];

		return [
			'id' => $id,
			'type' => 'examIntro',
			'img' => $introImages[$partNumber] ?? '',
			'part' => $partNumber,
			'texts' => [
				'At the end of the test, the scores in the three areas (verbal reasoning, quantitative reasoning and English) and general scores will be displayed: a general multidisciplinary score, a general score with a verbal emphasis and a score with a quantitative emphasis.',
				'The test scores are only an estimate of the psychometric exam scores, and do not serve as a substitute for the scores of a standardized psychometric exam.'
			]
		];
	}

	private function createQuestionIntroItems(int $partNumber, string $questionType, array $settings): array
	{
		$questionSettings = $this->getQuestionSettingsByType($questionType, $settings);

		// ⚠️ repeater ACF
		$introRepeater = $questionSettings['intro'] ?? [];

		// если repeater пустой → возвращаем дефолтный интро
		if (empty($introRepeater) || !is_array($introRepeater)) {
			return [
				[
					'type' => 'questionIntro',
					'part' => $partNumber,
					'questionPart' => $this->getQuestionTypeDisplayName($questionType),
					'texts' => [
						'This section contains questions of type: ' . $this->getQuestionTypeDisplayName($questionType),
						'Please read each question carefully and select the best answer.'
					]
				]
			];
		}

		$result = [];

		foreach ($introRepeater as $row) {
			$result[] = [
				'type' => 'questionIntro',
				'part' => $partNumber,
				'questionPart' => $this->getQuestionTypeDisplayName($questionType),
				'texts' => $row['text'] ?? '',
			];
		}

		return $result;
	}


	private function createQuestionItem(int $id, object $question, int $partNumber, string $questionType, array $settings): array
	{
		$questionSettings = $this->getQuestionSettingsByType($questionType, $settings);
		$time = $questionSettings['question_time'] ?? 4;

		$questionData = get_field('question', $question->ID);
		$answerData = get_field('answer', $question->ID);
		$readingPassage = get_field('reading_passage', $question->ID);
		$visible = get_field('visible', $question->ID);
		$hasReadingPassage = get_field('there_is_reading_passage', $question->ID);

		$baseItem = [
			'pid' => $question->ID,
			'part' => $partNumber,
			'time' => (int) $time,
			'questionsPart' => $this->getQuestionTypeDisplayName($questionType),
		];

		// ✅ если есть Passage → два элемента
		if ($hasReadingPassage === true) {
			return [
				'questionText' => array_merge($baseItem, [
					'id' => $id,
					'type' => 'questionText',
					'visible' => $visible,
					'title' => $question->post_title,
					'questions' => $this->formatReadingPassage($readingPassage),
				]),

				'questionTQ' => array_merge($baseItem, [
					'type' => 'questionTQ',
					'visible' => $visible,
					'question' => [
						'question' => $questionData['question_text'] ?? '',
						'audio' => $questionData['question_audio'] ?? '',
					],
					'questions' => $this->formatReadingPassage($readingPassage),
					'title' => $question->post_title,
					'answers' => $this->formatAnswers($answerData),
					'correctAnswer' => (int) get_field('correct_answer', $question->ID),
				]),
			];
		}

		// ✅ если simpleQuestion → возвращаем questionTQ, но без текстового passage
		return [
			'questionTQ' => array_merge($baseItem, [
				'id' => $id,
				'type' => 'simpleQuestion',
				'visible' => $visible,
				'question' => [
					'question' => $questionData['question_text'] ?? '',
					'audio' => $questionData['question_audio'] ?? '',
				],
				'title' => $question->post_title,
				'answers' => $this->formatAnswers($answerData ?? []),
				'correctAnswer' => (int) get_field('correct_answer', $question->ID),
			]),
		];
	}




	private function createPauseItem(int $id, int $partNumber, array $settings): array
	{
		return [
			'id' => $id,
			'type' => 'pause',
			'img' => $this->getPauseImage($partNumber),
			'time' => 5
		];
	}

	private function addNextLinks(array &$examData): void
	{
		$ids = array_keys($examData);

		for ($i = 0; $i < count($ids) - 1; $i++) {
			$examData[$ids[$i]]['next'] = $ids[$i + 1];
		}
	}

	private function getQuestionSettingsByType(string $questionType, array $settings): array
	{
		foreach ($settings['question_setting'] as $setting) {
			if ($setting['question_type'] === $questionType) {
				return $setting;
			}
		}

		return [];
	}

	private function getQuestionTypeDisplayName(string $questionType): string
	{
		$displayNames = [
			'verbal-inference' => 'Inference',
			'verbal-reading' => 'Reading',
			'verbal-analogies' => 'Analogies',
			'verbal-sentence-completion' => 'Sentence Completion',
			'quantitative-graphs' => 'Graphs',
			'quantitative-problem-solving' => 'Problem Solving',
			'quantitative-geometry' => 'Geometry',
			'quantitative-algebra' => 'Algebra',
			'english-sentence-completion' => 'Sentence Completion',
			'english-restatements' => 'Restatements',
			'english-reading-comprehension' => 'Reading Comprehension'
		];

		return $displayNames[$questionType] ?? $questionType;
	}

	private function formatAnswers(array $answers): array
	{
		if (!is_array($answers)) {
			return [];
		}

		$formatted = [];
		foreach ($answers as $answer) {
			if (is_array($answer) && isset($answer['url'])) {
				$formatted[] = $answer['url'];
			} elseif (is_string($answer)) {
				$formatted[] = $answer;
			}
		}

		return $formatted;
	}

	private function formatReadingPassage(mixed $readingPassage): array
	{
		if (!is_array($readingPassage)) {
			return [];
		}

		$formatted = [];
		foreach ($readingPassage as $paragraph) {
			$formatted[] = [
				'question' => $paragraph['paragraph_text'] ?? '',
				'audio' => $paragraph['paragraph_audio'] ?? ''
			];
		}

		return $formatted;
	}

	private function getPauseImage(int $partNumber): string
	{
		// Здесь можно добавить логику для разных изображений паузы
		return get_template_directory_uri() . '/assets/img/pause-' . $partNumber . '.png';
	}

	private function extractPartFromQuestionType(string $questionType): int
	{
		$partMapping = [
			'verbal-inference' => 1,
			'verbal-reading' => 1,
			'verbal-analogies' => 1,
			'verbal-sentence-completion' => 1,
			'quantitative-graphs' => 2,
			'quantitative-problem-solving' => 2,
			'quantitative-geometry' => 2,
			'quantitative-algebra' => 2,
			'english-sentence-completion' => 3,
			'english-restatements' => 3,
			'english-reading-comprehension' => 3
		];

		return $partMapping[$questionType] ?? 1;
	}
}