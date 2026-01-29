<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="ko">
      <head>
        <title>상견례 얼굴상 테스트 Sitemap</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #D4A5A5 0%, #F5E6E6 100%);
            color: #5D3A3A;
            min-height: 100vh;
            padding: 2rem;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          header {
            text-align: center;
            margin-bottom: 2rem;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.7);
            border-radius: 16px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(93, 58, 58, 0.1);
          }
          h1 {
            font-size: 2rem;
            color: #5D3A3A;
            margin-bottom: 0.5rem;
          }
          .subtitle {
            color: #8B5A5A;
            font-size: 0.9rem;
          }
          .stats {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-top: 1rem;
          }
          .stat {
            text-align: center;
          }
          .stat-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #E87D8C;
          }
          .stat-label {
            font-size: 0.75rem;
            color: #8B5A5A;
            text-transform: uppercase;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(93, 58, 58, 0.1);
          }
          th {
            background: linear-gradient(135deg, #E87D8C 0%, #D4A5A5 100%);
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: white;
          }
          td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgba(212, 165, 165, 0.3);
            font-size: 0.875rem;
          }
          tr:hover {
            background: rgba(232, 125, 140, 0.1);
          }
          a {
            color: #8B5A5A;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            color: #E87D8C;
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 600;
          }
          .priority-high {
            background: rgba(76, 175, 80, 0.2);
            color: #4CAF50;
          }
          .priority-medium {
            background: rgba(255, 193, 7, 0.2);
            color: #FFC107;
          }
          .priority-low {
            background: rgba(158, 158, 158, 0.2);
            color: #9E9E9E;
          }
          .lang-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
          }
          .lang-tag {
            display: inline-block;
            padding: 0.125rem 0.375rem;
            background: rgba(232, 125, 140, 0.2);
            border-radius: 4px;
            font-size: 0.625rem;
            color: #E87D8C;
            text-transform: uppercase;
          }
          footer {
            text-align: center;
            margin-top: 2rem;
            padding: 1rem;
            color: #8B5A5A;
            font-size: 0.75rem;
          }
          @media (max-width: 768px) {
            body { padding: 1rem; }
            h1 { font-size: 1.5rem; }
            .stats { flex-direction: column; gap: 1rem; }
            table { font-size: 0.75rem; }
            th, td { padding: 0.5rem; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>상견례 얼굴상 테스트 Sitemap</h1>
            <p class="subtitle">AI가 판정하는 상견례 얼굴상 테스트 - SEO Sitemap</p>
            <div class="stats">
              <div class="stat">
                <div class="stat-value"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total URLs</div>
              </div>
              <div class="stat">
                <div class="stat-value">6</div>
                <div class="stat-label">Languages</div>
              </div>
            </div>
          </header>

          <table>
            <thead>
              <tr>
                <th style="width: 50%">URL</th>
                <th>Priority</th>
                <th>Change Freq</th>
                <th>Languages</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td>
                    <xsl:choose>
                      <xsl:when test="sitemap:priority &gt;= 0.8">
                        <span class="priority priority-high"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:when test="sitemap:priority &gt;= 0.5">
                        <span class="priority priority-medium"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:when>
                      <xsl:otherwise>
                        <span class="priority priority-low"><xsl:value-of select="sitemap:priority"/></span>
                      </xsl:otherwise>
                    </xsl:choose>
                  </td>
                  <td><xsl:value-of select="sitemap:changefreq"/></td>
                  <td>
                    <div class="lang-tags">
                      <xsl:for-each select="xhtml:link[@rel='alternate']">
                        <span class="lang-tag"><xsl:value-of select="@hreflang"/></span>
                      </xsl:for-each>
                    </div>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>

          <footer>
            <p>상견례 얼굴상 테스트 | <a href="https://moony01.com/sanggyeonrye-test/">moony01.com/sanggyeonrye-test</a></p>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
