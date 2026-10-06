import java.nio.file.Path;
import java.nio.file.Paths;

public class AtlassianTraversalFix {
    public static Path safeResolve(String webRoot, String requestPath) throws SecurityException {
    String decoded = java.net.URLDecoder.decode(
        java.net.URLDecoder.decode(requestPath, java.nio.charset.StandardCharsets.UTF_8),
        java.nio.charset.StandardCharsets.UTF_8); // decode x2 to catch %252e
    String lower = decoded.toLowerCase();
    if (lower.contains("..") || lower.contains("%2e") || lower.contains("%5c")
        || lower.contains("%3a") || lower.contains("\\") || lower.contains("::")) {
        throw new SecurityException("traversal blocked");
    }
    Path root = Paths.get(webRoot).toAbsolutePath().normalize();
    Path resolved = root.resolve(requestPath).normalize();
    if (!resolved.startsWith(root)) {
        throw new SecurityException("escape blocked");
    }
    return resolved;
    }
}
// Ops until patched: WAF block (.. + / \ :: encoded), Tomcat RewriteValve, take internet-facing nodes offline.
