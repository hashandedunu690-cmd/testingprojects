<?php
require __DIR__ . '/partials/config.php';
$id = isset($_GET['id']) ? $_GET['id'] : null;
$product = $id ? fetch_json('/api/products/' . urlencode($id)) : null;
if (!$product) { http_response_code(404); $pageTitle = 'Product Not Found'; }
else { $pageTitle = $product['name']; }
?>
<?php include __DIR__ . '/partials/header.php'; ?>
<?php include __DIR__ . '/partials/nav.php'; ?>

<?php if (!$product): ?>
<section class="container"><h1>Product not found</h1></section>
<?php else: ?>
<section class="product-hero">
  <div class="product-media" style="background-image:url('<?php echo htmlspecialchars($product['image']); ?>')"></div>
  <div class="product-info container">
    <h1><?php echo htmlspecialchars($product['name']); ?></h1>
    <p class="lead"><?php echo htmlspecialchars($product['tagline']); ?></p>
    <div class="pill-row">
      <span class="pill">Caffeine: <?php echo (int)$product['caffeineMg']; ?>mg</span>
      <span class="pill">Sugar: <?php echo htmlspecialchars($product['sugar']); ?></span>
      <span class="pill">Flavor: <?php echo htmlspecialchars($product['flavor']); ?></span>
    </div>
    <div class="actions">
      <button class="btn btn-primary">Buy for $<?php echo number_format($product['price'], 2); ?></button>
      <a class="btn" href="/products.php">Back to Products</a>
    </div>
  </div>
</section>

<section class="container">
  <h3>Available Sizes</h3>
  <div class="pill-row">
    <?php foreach ($product['sizes'] as $size): ?>
      <span class="pill pill-outline"><?php echo htmlspecialchars($size); ?></span>
    <?php endforeach; ?>
  </div>
</section>
<?php endif; ?>

<?php include __DIR__ . '/partials/footer.php'; ?>