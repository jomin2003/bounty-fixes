<?php
// FIX for CVE-2026-39795 class (SendPress) + CVE-2026-42417 + CVE-2026-42415
// BEFORE (vulnerable):
// return $wpdb->get_row("SELECT * FROM $this->table_name WHERE $column = '$row_id' LIMIT 1;");

// AFTER — drop-in fix:
function get_row_safe($wpdb, $table_name, $column, $row_id) {
    $column = sanitize_key($column); // allowlist identifier, cannot be placeholder
    // table_name must be $wpdb->prefix . known slug, never raw $_POST
    return $wpdb->get_row(
        $wpdb->prepare("SELECT * FROM $table_name WHERE $column = %s LIMIT 1;", $row_id)
    );
}
// call-site hardening:
$subscriberid = absint($_POST['subscriberid'] ?? 0);
$name = sanitize_text_field($_POST['name'] ?? '');
