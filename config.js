"user strict";

var config = {};
config.maxFileSize = '100'; // 100MB
config.downloadFolder = './data/';

config.rssLinks = ['http://vnexpress.net/rss/tin-moi-nhat.rss',
					'http://vnexpress.net/rss/thoi-su.rss',
					'http://vnexpress.net/rss/doi-song.rss',
					'http://vnexpress.net/rss/the-gioi.rss',
					'http://vnexpress.net/rss/kinh-doanh.rss',
					'http://vnexpress.net/rss/giai-tri.rss',
					'http://vnexpress.net/rss/the-thao.rss',
					'http://vnexpress.net/rss/phap-luat.rss',
					'http://vnexpress.net/rss/du-lich.rss',
					'http://vnexpress.net/rss/khoc-hoc.rss',
					'http://vnexpress.net/rss/so-hoa.rss',
					'http://vnexpress.net/rss/oto-xe-may.rss',
					'http://vnexpress.net/rss/cong-dong.rss',
					'http://vnexpress.net/rss/tam-su.rss',
					'http://vnexpress.net/rss/cuoi.rss'];

module.exports = config;