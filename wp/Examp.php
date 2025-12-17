<?php

namespace ms\Models;

class Exam extends BaseModel {
	
	protected function getPostType(): string {
		return 'exam';
	}
	
	public function getSettings(): array {
		return [
			'exam_intro'      => get_field( 'exam_intro', 'option' ),
			'exam_intro_1'      => get_field( 'exam_intro_1', 'option' ),
			'exam_intro_2'      => get_field( 'exam_intro_2', 'option' ),
			'exam_intro_3'      => get_field( 'exam_intro_3', 'option' ),
			'exam_part_1_title'      => get_field( 'exam_part_1_title', 'option' ),
			'exam_part_2_title'      => get_field( 'exam_part_2_title', 'option' ),
			'exam_part_3_title'      => get_field( 'exam_part_3_title', 'option' ),
			'exam_intro_1_title'      => get_field( 'exam_intro_1_title', 'option' ),
			'exam_intro_2_title'      => get_field( 'exam_intro_2_title', 'option' ),
			'exam_intro_3_title'      => get_field( 'exam_intro_3_title', 'option' ),
			'exam_intro_title'      => get_field( 'exam_intro_title', 'option' ),
			'second_reading_passage'      => get_field( 'second_reading_passage', 'option' ),
			'question_setting' => get_field( 'question_setting', 'option' ),
		];
	}
	
	
	public function getRelatedQuestions(): array {
		$questions = [];
		
		// Получаем все вопросы, связанные с этим экзаменом
		$args = [
			'post_type'        => 'question',
			'post_status'      => 'publish',
			'posts_per_page'   => -1,
			'suppress_filters' => false,
			'meta_query'       => [
				[
					'key'     => 'exam',
					'value'   => $this->getId(),
					'compare' => 'LIKE'
				],
			],
			'orderby'          => 'meta_value_num',
			'meta_key'         => 'order',
			'order'            => 'ASC',
			'lang'             => 'all',
		];
		
		$query = new \WP_Query( $args );
		
		if ( $query->have_posts() ) {
			while ( $query->have_posts() ) {
				$query->the_post();
				$questions[] = get_post();
			}
			wp_reset_postdata();
		}
		
		return $questions;
	}
	
	public function getPartsCount(): int {
		$questions = $this->getRelatedQuestions();
		$parts     = [];
		
		foreach ( $questions as $question ) {
			$questionType = get_field( 'question_type', $question->ID );
			if ( $questionType ) {
				$parts[] = $this->extractPartFromQuestionType( $questionType );
			}
		}
		
		return count( array_unique( $parts ) );
	}
	
	private function extractPartFromQuestionType( string $questionType ): int {
		// Логика определения части на основе типа вопроса
		$partMapping = [
			'verbal-inference'              => 1,
			'verbal-reading'                => 1,
			'verbal-analogies'              => 1,
			'verbal-sentence-completion'    => 1,
			'quantitative-graphs'           => 2,
			'quantitative-problem-solving'  => 2,
			'quantitative-geometry'         => 2,
			'quantitative-algebra'          => 2,
			'english-sentence-completion'   => 3,
			'english-restatements'          => 3,
			'english-reading-comprehension' => 3
		];
		
		return $partMapping[ $questionType ] ?? 1;
	}
	
	public function getQuestionTypesByParts(): array {
		$questions            = $this->getRelatedQuestions();
		$questionTypesByParts = [];
		
		foreach ( $questions as $question ) {
			$questionType = get_field( 'question_type', $question->ID );
			
			if ( $questionType ) {
				$part = $this->extractPartFromQuestionType( $questionType );
				
				if ( ! isset( $questionTypesByParts[ $part ] ) ) {
					$questionTypesByParts[ $part ] = [];
				}
				
				if ( ! in_array( $questionType, $questionTypesByParts[ $part ] ) ) {
					$questionTypesByParts[ $part ][] = $questionType;
				}
			}
		}
		
		return $questionTypesByParts;
	}
	
	public function getQuestionsCount(): int {
		return count( $this->getRelatedQuestions() );
	}
}