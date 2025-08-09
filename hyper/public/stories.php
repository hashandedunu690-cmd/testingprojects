<?php
$pageTitle = 'Stories';
require __DIR__ . '/partials/config.php';
$stories = fetch_json('/api/stories') ?: [];
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<section class="page-header container">
  <h1>Stories</h1>
  <p class="muted">Athletes, events, and culture—powered by HYPER.</p>
</section>

<section class="container">
  <div class="card-grid">
    <?php foreach ($stories as $story): ?>
      <a class="card card-story" href="/story.php?id=<?php echo urlencode($story['id']); ?>">
        <div class="card-image" style="background-image:url('<?php echo htmlspecialchars($story['image']); ?>')"></div>
        <div class="card-body">
          <span class="badge"><?php echo htmlspecialchars($story['category']); ?></span>
          <h3><?php echo htmlspecialchars($story['title']); ?></h3>
          <p class="muted"><?php echo htmlspecialchars($story['subtitle']); ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<?php include __DIR__ . '/partials/footer.php'; ?>