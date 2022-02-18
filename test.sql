\c nc_news_test

SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count FROM articles INNER JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY title DESC;