<?php
$pageTitle = 'Events';
require __DIR__ . '/partials/config.php';
$events = fetch_json('/api/events') ?: [];
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<section class="page-header container">
  <h1>Events</h1>
  <p class="muted">From motorsport to big air—watch HYPER athletes send it.</p>
</section>

<section class="container">
  <div class="card-grid">
    <?php foreach ($events as $event): ?>
      <a class="card" href="<?php echo htmlspecialchars($event['link']); ?>">
        <div class="card-image" style="background-image:url('<?php echo htmlspecialchars($event['image']); ?>')"></div>
        <div class="card-body">
          <span class="badge"><?php echo htmlspecialchars($event['location']); ?></span>
          <h3><?php echo htmlspecialchars($event['name']); ?></h3>
          <p class="muted">Date: <?php echo htmlspecialchars($event['date']); ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<?php include __DIR__ . '/partials/footer.php'; ?>