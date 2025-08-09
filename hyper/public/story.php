<?php
require __DIR__ . '/partials/config.php';
$id = isset($_GET['id']) ? $_GET['id'] : null;
$story = $id ? fetch_json('/api/stories/' . urlencode($id)) : null;
if (!$story) { http_response_code(404); $pageTitle = 'Story Not Found'; }
else { $pageTitle = $story['title']; }
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<?php if (!$story): ?>
<section class="container"><h1>Story not found</h1></section>
<?php else: ?>
<article class="container story">
  <header class="story-header">
    <h1><?php echo htmlspecialchars($story['title']); ?></h1>
    <p class="muted"><?php echo htmlspecialchars($story['subtitle']); ?> · <?php echo htmlspecialchars($story['category']); ?> · <?php echo htmlspecialchars($story['publishedAt']); ?></p>
    <div class="story-hero" style="background-image:url('<?php echo htmlspecialchars($story['image']); ?>')"></div>
  </header>
  <section class="story-body">
    <p><?php echo nl2br(htmlspecialchars($story['content'])); ?></p>
  </section>
</article>
<?php endif; ?>

<?php include __DIR__ . '/partials/footer.php'; ?>