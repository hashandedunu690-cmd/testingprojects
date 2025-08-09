<?php
$pageTitle = 'Products';
require __DIR__ . '/partials/config.php';
$products = fetch_json('/api/products') ?: [];
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<section class="page-header container">
  <h1>Products</h1>
  <p class="muted">Choose your edge. Classic, Zero, and bold flavors.</p>
</section>

<section class="container">
  <div class="card-grid">
    <?php foreach ($products as $product): ?>
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

<?php include __DIR__ . '/partials/footer.php'; ?>