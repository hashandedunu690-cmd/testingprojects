<?php
$API_BASE = getenv('HYPER_API_BASE') ?: 'http://localhost:4000';

function fetch_json($path) {
  global $API_BASE;
  $url = rtrim($API_BASE, '/') . $path;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_TIMEOUT, 5);

  $response = curl_exec($ch);
  $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err = curl_error($ch);
  curl_close($ch);

  if ($response === false || $httpCode >= 400) {
    return null;
  }

  return json_decode($response, true);
}
?>