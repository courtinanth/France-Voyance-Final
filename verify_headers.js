const fs = require('fs');
const path = require('path');
const glob = require('glob');

const rootDir = __dirname;
const htmlFiles = glob.sync('**/*.html', { cwd: rootDir, ignore: ['node_modules/**', '.git/**'] });

let issues = [];

console.log(`Scanning ${htmlFiles.length} HTML files...`);

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Checks
    const hasMainJs = content.includes('src="/js/main.js') || content.includes('src="js/main.js');
    const hasStyleCss = content.includes('href="/css/style.css') || content.includes('href="css/style.css');
    const hasMobileToggle = content.includes('class="mobile-toggle"') || content.includes("class='mobile-toggle'");
    const hasNav = content.includes('class="main-nav"') || content.includes("class='main-nav'");

    let fileIssues = [];
    if (!hasMainJs) fileIssues.push('Missing main.js');
    if (!hasStyleCss) fileIssues.push('Missing style.css');
    if (!hasMobileToggle) fileIssues.push('Missing .mobile-toggle');
    if (!hasNav) fileIssues.push('Missing .main-nav');

    // Check for "identical" content proxy: count .nav-item
    const navItemCount = (content.match(/class="nav-item"/g) || []).length + (content.match(/class='nav-item'/g) || []).length;

    // index.html has 6 nav items. We expect 6.
    if (hasNav && navItemCount !== 6) {
        fileIssues.push(`Main Nav has ${navItemCount} items (expected 6)`);
    }

    if (fileIssues.length > 0) {
        issues.push({ file, missing: fileIssues });
    }
});

if (issues.length === 0) {
    console.log("✅ All HTML files appear to have the correct header, scripts, and identical menu structure.");
    fs.writeFileSync('header_audit_log.txt', "✅ All HTML files appear to have the correct header, scripts, and identical menu structure.");
} else {
    console.log(`❌ Found issues in ${issues.length} files:`);
    let logContent = `❌ Found issues in ${issues.length} files:\n`;
    issues.forEach(issue => {
        logContent += `- ${issue.file}: ${issue.missing.join(', ')}\n`;
    });
    fs.writeFileSync('header_audit_log.txt', logContent);
    console.log("Log specific details written to header_audit_log.txt");
}
