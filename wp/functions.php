<?php

/**
 * GeneratePress child theme functions and definitions.
 *
 * Add your custom PHP in this file.
 * Only edit this file if you have direct access to it on your server (to fix errors if they happen).
 */

// Подключаем админку только в админке
if (is_admin()) {
  require_once get_stylesheet_directory() . '/inc/ms-business-data-admin.php';
}

require_once get_stylesheet_directory() . '/app/bootstrap.php';

// Подключаем шорткоды всегда (фронт и админ)
require_once get_stylesheet_directory() . '/inc/ms-business-data-shortcodes.php';

// Подключаем smooth-scroll
function enqueue_smooth_scroll_script()
{
  // Получаем путь к теме, поддерживает и родительскую, и дочернюю тему
  $script_path = get_stylesheet_directory_uri() . '/js/smooth-scroll.js';

  wp_enqueue_script('smooth-scroll', $script_path, [], '1.1', true);

  wp_enqueue_style(
    'mobile-menu',
    get_stylesheet_directory_uri() . '/assets/css/mobile-menu.css',
    [],
    filemtime(get_stylesheet_directory() . '/assets/css/mobile-menu.css')
  );

  wp_enqueue_script(
    'c-app',
    get_stylesheet_directory_uri() . '/assets/js/app.js',
    [],
    '',
    true
  );

  wp_enqueue_style(
    'ms-loader',
    get_stylesheet_directory_uri() . '/assets/modules/ms-loader/ms-loader.css',
    [],
    ''
  );

  wp_enqueue_script(
    'ms-loader',
    get_stylesheet_directory_uri() . '/assets/modules/ms-loader/ms-loader.js',
    [],
    '',
    true
  );
}
add_action('wp_enqueue_scripts', 'enqueue_smooth_scroll_script');

function ms_get_url_with_lang_prefix($path = '/')
{
  // Ensure the path starts with a slash and normalize it
  $path = '/' . ltrim($path, '/');

  // Check if Polylang is active and the pll_current_language function exists
  if (function_exists('pll_current_language')) {
    // Get the current language slug (e.g., 'en', 'ru')
    $lang = pll_current_language('slug');

    // If a valid language slug is retrieved, prepend it to the path
    if ($lang) {
      return '/' . $lang . $path;
    }
  }

  // Fallback: return the original path if Polylang is not active or no language is set
  return $path;
}

// Local Menu
register_nav_menus([
  'footer_1' => __('Footer 1', 'textdomain'),
  'footer_2' => __('Footer 2', 'textdomain'),
  'footer_3' => __('Footer 3', 'textdomain'),
  'footer_4' => __('Footer 4', 'textdomain'),
]);

include_once __DIR__ . '/template-parts/button-scroll-top.php';
include_once __DIR__ . '/blocks/accordion/accordion-block.php';

include_once __DIR__ . '/inc/ms-pagination.php';
include_once __DIR__ . '/inc/ms-filter-taxonomy.php';


// Подключаем анимацию появления карточек постов (fade-in) только там, где нужно
add_action('wp_enqueue_scripts', 'ms_enqueue_posts_fadein', 30);
function ms_enqueue_posts_fadein()
{
  // Архивы (включая категории/теги/CPT), главная блога, поиск, одиночный пост/товар
  if (
    is_archive() ||
    is_home() ||
    is_search() ||
    is_singular(['post', 'product'])
  ) {
    $rel = '/js/posts-fadein.js';
    $path = get_stylesheet_directory() . $rel;
    $uri = get_stylesheet_directory_uri() . $rel;

    wp_enqueue_script(
      'ms-posts-fadein',
      $uri,
      ['jquery'], // оставил зависимость, как у тебя было
      file_exists($path) ? filemtime($path) : null,
      true
    );
  }
}

// Fonts

add_action('wp_enqueue_scripts', function () {
  $lang = function_exists('pll_current_language') ? pll_current_language('slug') : 'en';

  if (in_array($lang, ['en', 'ru'])) {
    wp_enqueue_style(
      'noto-sans-latin-cyr',
      content_url('/uploads/fonts/css/noto-sans-latin-cyr.css'),
      [],
      null
    );
  }

  if ($lang === 'he') {
    wp_enqueue_style(
      'noto-sans-hebrew',
      content_url('/uploads/fonts/css/noto-sans-hebrew.css'),
      [],
      null
    );
  }

  if ($lang === 'ar') {
    wp_enqueue_style(
      'noto-sans-arabic',
      content_url('/uploads/fonts/css/noto-sans-arabic.css'),
      [],
      null
    );
  }
});

// === Exams ===
function register_exam_cpt()
{
  register_post_type('exam', [
    'labels' => [
      'name' => 'Exams',
      'singular_name' => 'Exam',
    ],
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-welcome-learn-more',
    'supports' => ['title', 'editor', 'thumbnail'],
  ]);
}
add_action('init', 'register_exam_cpt');

// === Questions ===
function register_question_cpt()
{
  register_post_type('question', [
    'labels' => [
      'name' => 'Questions',
      'singular_name' => 'Question',
    ],
    'public' => true,
    'show_in_rest' => true,
    'menu_icon' => 'dashicons-editor-help',
    'supports' => ['title', 'editor'],
  ]);
}
add_action('init', 'register_question_cpt');

if (function_exists('acf_add_options_page')) {
  acf_add_options_page([
    'page_title' => 'Exam Settings',
    'menu_title' => 'Exam Settings',
    'menu_slug' => 'exam-settings',
    'capability' => 'manage_options',
    'redirect' => false,
    'position' => 25,
    'icon_url' => 'dashicons-welcome-learn-more',
  ]);
}

add_action('init', function () {
  register_taxonomy('question_type', 'question', [
    'label' => 'Questions Type',
    'public' => false,
    'show_ui' => true,
    'hierarchical' => false,
    'show_admin_column' => true,
    'rewrite' => false,
  ]);
});

add_filter('acf/load_field/name=question_type', function ($field) {
  $terms = get_terms([
    'taxonomy' => 'question_type',
    'hide_empty' => false,
    'lang' => '',
  ]);

  $choices = [];
  if (!is_wp_error($terms)) {
    foreach ($terms as $term) {
      $choices[$term->slug] = $term->name;
    }
  }

  $field['choices'] = $choices;
  return $field;
});

