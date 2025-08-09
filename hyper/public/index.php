<?php
$pageTitle = 'Home';
require __DIR__ . '/partials/config.php';
$products = fetch_json('/api/products') ?: [];
$stories = fetch_json('/api/stories') ?: [];
$featuredProducts = array_values(array_filter($products, fn($p) => isset($p['featured']) && $p['featured']));
$featuredStories = array_values(array_filter($stories, fn($s) => isset($s['featured']) && $s['featured']));
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<section class="hero">
  <div class="hero-media">
    <video class="hero-video" autoplay muted loop playsinline poster="https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1600&auto=format&fit=crop">
      <source src="https://cdn.coverr.co/videos/coverr-a-lone-runner-3297/1080p.mp4" type="video/mp4">
    </video>
  </div>
  <div class="hero-overlay">
    <h1>Push Beyond</h1>
    <p>Fuel for focus, strength, and style. This is HYPER.</p>
    <a class="btn btn-primary" href="/products.php">Shop Products</a>
  </div>
</section>

<section class="section container">
  <div class="section-header">
    <h2>Featured Products</h2>
    <a href="/products.php" class="link">View all</a>
  </div>
  <div class="card-grid">
    <?php foreach ($featuredProducts as $product): ?>
      <a class="card" href="/product.php?id=<?php echo urlencode($product['id']); ?>">
        <div class="card-image" style="background-image:url('<?php echo htmlspecialchars($product['image']); ?>')"></div>
        <div class="card-body">
          <h3><?php echo htmlspecialchars($product['name']); ?></h3>
          <p class="muted"><?php echo htmlspecialchars($product['tagline']); ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>

<section class="section container">
  <div class="section-header">
    <h2>Stories</h2>
    <a href="/stories.php" class="link">Explore</a>
  </div>
  <div class="card-grid">
    <?php foreach ($featuredStories as $story): ?>
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