<?php

namespace ms\Models;

use WP_Error;
use WP_Post;


abstract class BaseModel
{

  protected $postType;
  protected $postId;
  protected $post;
  protected $meta = [];

  public function __construct(int|null $postId = null)
  {
    $this->postType = $this->getPostType();

    if ($postId) {
      $this->load($postId);
    }
  }

  abstract protected function getPostType(): string;


  public function load(int $postId): bool
  {
    // ✅ Получаем правильный ID с учётом языка (WPML/Polylang)
    if (function_exists('apply_filters')) {
      $translatedId = apply_filters('wpml_object_id', $postId, $this->postType, true);
      if ($translatedId) {
        $postId = $translatedId;
      }
    }

    // ✅ Отключаем фильтрацию языка при загрузке поста
    $post = get_post($postId, OBJECT, 'edit');

    if (!$post || $post->post_type !== $this->postType) {
      return false;
    }

    $this->postId = $postId;
    $this->post = $post;
    $this->loadMeta();

    return true;
  }



  protected function loadMeta(): void
  {
    if ($this->postId) {
      $this->meta = get_post_meta($this->postId);

      // Убираем массивы из meta полей если они содержат только одно значение
      foreach ($this->meta as $key => $value) {
        if (is_array($value) && count($value) === 1) {
          $this->meta[$key] = $value[0];
        }
      }
    }
  }


  public function get(string $field, mixed $default = null): mixed
  {
    // Сначала проверяем основные поля поста
    if (isset($this->post->$field)) {
      return $this->post->$field;
    }

    // Затем проверяем meta поля
    if (isset($this->meta[$field])) {
      return $this->meta[$field];
    }

    return $default;
  }

  public function set(string $field, mixed $value): bool
  {
    // Если это основное поле поста
    if (in_array($field, ['post_title', 'post_content', 'post_excerpt', 'post_status'])) {
      $postData = [
        'ID' => $this->postId,
        $field => $value
      ];

      $result = wp_update_post($postData);
      if ($result && !is_wp_error($result)) {
        $this->post->$field = $value;

        return true;
      }

      return false;
    }

    // Если это meta поле
    if ($this->postId) {
      $result = update_post_meta($this->postId, $field, $value);
      if ($result) {
        $this->meta[$field] = $value;
      }

      return $result;
    }

    return false;
  }

  public function delete(string $field): bool
  {
    if ($this->postId && isset($this->meta[$field])) {
      $result = delete_post_meta($this->postId, $field);
      if ($result) {
        unset($this->meta[$field]);
      }

      return $result;
    }

    return false;
  }


  public function save(array $data = []): int|WP_Error
  {
    if ($this->postId) {
      // Обновление существующего поста
      $postData = array_merge([
        'ID' => $this->postId,
        'post_type' => $this->postType
      ], $data);

      $result = wp_update_post($postData);

      if ($result && !is_wp_error($result)) {
        $this->load($this->postId);
      }

      return $result;
    } else {
      // Создание нового поста
      $postData = array_merge([
        'post_type' => $this->postType,
        'post_status' => 'publish'
      ], $data);

      $postId = wp_insert_post($postData);

      if ($postId && !is_wp_error($postId)) {
        $this->load($postId);
      }

      return $postId;
    }
  }

  public function deletePost(bool $force = false): bool
  {
    if ($this->postId) {
      $result = wp_delete_post($this->postId, $force);

      if ($result) {
        $this->postId = null;
        $this->post = null;
        $this->meta = [];
      }

      return (bool) $result;
    }

    return false;
  }

  public function getMeta(): array
  {
    return $this->meta;
  }

  public function setMeta(array $meta): bool
  {
    if (!$this->postId) {
      return false;
    }

    $success = true;
    foreach ($meta as $key => $value) {
      if (!$this->set($key, $value)) {
        $success = false;
      }
    }

    return $success;
  }

  public function getTerms(string $taxonomy): array
  {
    if ($this->postId) {
      return wp_get_post_terms($this->postId, $taxonomy);
    }

    return [];
  }

  public function setTerms(string $taxonomy, array $terms)
  {
    if ($this->postId) {
      return wp_set_post_terms($this->postId, $terms, $taxonomy);
    }

    return false;
  }


  public function getId(): int|null
  {
    return $this->postId;
  }


  public function exists(): bool
  {
    return $this->postId !== null && $this->post !== null;
  }

  public function getPost(): WP_Post|null
  {
    return $this->post;
  }
}
