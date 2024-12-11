import 'dart:async';
import 'dart:convert';
import 'package:hoi_vien/ui/post_article.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';

import '../api_config.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  bool _isLoading = false;
  List<Article> _articleList = [];
  int _currentPage = 1;
  final int _pageSize = 10;
  int? _totalItem;
  late ScrollController _sc;
  String _searchContent = '';
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _sc = ScrollController();
    _fetchArticle();
    _sc.addListener(() {
      if (_sc.position.pixels == _sc.position.maxScrollExtent) {
        _fetchArticle();
      }
    });
  }

  @override
  void dispose() {
    _sc.dispose();
    super.dispose();
  }

  Future<void> _fetchArticle() async {
    if (_totalItem != null && _articleList.length == _totalItem) return;
    if (!_isLoading) {
      setState(() {
        _isLoading = true;
      });

      final response = await http.get(Uri.parse(
          '${ApiConfig.baseUrl}/Article/getArticleByContent?content=$_searchContent&pageNumber=$_currentPage&pageSize=$_pageSize'));
      if (response.statusCode == 200) {
        final resBody = json.decode(response.body);
        final listItems = resBody['articles'] as List;

        _articleList.addAll(
            listItems.map((article) => Article.fromJson((article))).toList());

        _totalItem = resBody['totalArticles'];
        _currentPage++;
      }

      setState(() {
        _isLoading = false;
      });
    }
  }

  String timeAgo(DateTime dateTime) {
    final Duration diff = DateTime.now().difference(dateTime);

    if (diff.inDays > 0) {
      return diff.inDays == 1 ? 'Hôm qua' : '${diff.inDays} ngày trước';
    } else if (diff.inHours > 0) {
      return diff.inHours == 1 ? '1 giờ trước' : '${diff.inHours} giờ trước';
    } else if (diff.inMinutes > 0) {
      return diff.inMinutes == 1
          ? '1 phút trước'
          : '${diff.inMinutes} phút trước';
    } else if (diff.inSeconds > 0) {
      return diff.inSeconds == 1 ? 'Vừa xong' : '${diff.inSeconds} giây trước';
    } else {
      return 'Vừa xong';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        title: Container(
            width: double.infinity,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8.0),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    onChanged: (value) {
                      _searchContent = value;
                      _articleList = [];
                      _totalItem = null;
                      _fetchArticle();

                      if (_debounce?.isActive ?? false) _debounce!.cancel();

                      _debounce = Timer(const Duration(milliseconds: 300), () {
                        _fetchArticle();
                      });
                    },
                    decoration: const InputDecoration(
                      hintText: 'Tìm kiếm...',
                      hintStyle: TextStyle(color: Colors.grey),
                      border: InputBorder.none,
                      prefixIcon: Icon(Icons.search, color: Colors.grey),
                      contentPadding: EdgeInsets.symmetric(vertical: 10),
                    ),
                  ),
                ),
              ],
            )),
      ),
      body: _articleList.isEmpty
          ? Center(
              child: Column(
              children: [
                const Text('Không có bài viết nào.',
                    style:
                        TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const PostArticlePage()),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  child: Text(
                    'Tạo bài đăng',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ),
              ],
            ))
          : Center(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 400),
                child: ListView.separated(
                  itemCount: _articleList.length + 2,
                  separatorBuilder: (BuildContext context, int index) {
                    return const Divider();
                  },
                  itemBuilder: (BuildContext context, int index) {
                    if (index == _articleList.length + 1) {
                      return _buildProgressIndicator();
                    }
                    if (index == 0) {
                      return Center(
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const PostArticlePage()),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          child: Text(
                            'Tạo bài đăng',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ),
                      );
                    }
                    final item = _articleList[index - 1];
                    return Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const _AvatarImage(''),
                              const SizedBox(width: 16),
                              Expanded(
                                child: RichText(
                                  overflow: TextOverflow.ellipsis,
                                  text: TextSpan(
                                    text: item.accName,
                                    style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 20,
                                        color: Colors.black),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.only(top: 5.0),
                                child: Text(timeAgo(item.send_at),
                                    style:
                                        Theme.of(context).textTheme.bodySmall),
                              ),
                              const Padding(
                                padding: EdgeInsets.only(left: 8.0),
                                child: Icon(
                                  Icons.more_horiz,
                                ),
                              )
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(item.content,
                              style: Theme.of(context).textTheme.bodyLarge),
                          if (item.imageUrl != null)
                            Container(
                              height: 200,
                              margin: const EdgeInsets.only(top: 8.0),
                              child: FadeInImage.assetNetwork(
                                placeholder: 'assets/img_placeholder.png',
                                image: item.imageUrl!,
                                imageErrorBuilder:
                                    (context, error, stackTrace) => Image.asset(
                                  'assets/img_placeholder.png',
                                ),
                              ),
                            ),
                          _ActionsRow(item: item),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ),
    );
  }

  Widget _buildProgressIndicator() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Center(
        child: Opacity(
          opacity: _isLoading ? 1.0 : 00,
          child: const CircularProgressIndicator(),
        ),
      ),
    );
  }
}

class _AvatarImage extends StatelessWidget {
  final String url;
  const _AvatarImage(this.url);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 50,
      height: 50,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(50),
        child: FadeInImage.assetNetwork(
          placeholder: 'assets/avatar_placeholder.png',
          image: url,
          imageErrorBuilder: (context, error, stackTrace) => Image.asset(
            'assets/avatar_placeholder.png',
          ),
        ),
      ),
    );
  }
}

class _ActionsRow extends StatelessWidget {
  final Article item;
  const _ActionsRow({required this.item});

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(
          iconTheme: const IconThemeData(color: Colors.grey, size: 18),
          textButtonTheme: TextButtonThemeData(
              style: ButtonStyle(
            foregroundColor: WidgetStateProperty.all(Colors.grey),
          ))),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.favorite_border),
            label: Text(item.likesCount == 0 ? '' : item.likesCount.toString()),
          ),
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.mode_comment_outlined),
            label: Text(
                item.commentsCount == 0 ? '' : item.commentsCount.toString()),
          ),
          TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.repeat_rounded),
            label: Text(
                item.retweetsCount == 0 ? '' : item.retweetsCount.toString()),
          ),
          IconButton(
            icon: const Icon(CupertinoIcons.share_up),
            onPressed: () {},
          )
        ],
      ),
    );
  }
}

class Article {
  int id;
  String content;
  String? imageUrl;
  int likesCount;
  int commentsCount;
  int retweetsCount;
  String accName;
  DateTime send_at;

  Article(
      {required this.id,
      required this.content,
      this.imageUrl,
      required this.likesCount,
      required this.commentsCount,
      required this.retweetsCount,
      required this.accName,
      required this.send_at});

  factory Article.fromJson(Map<String, dynamic> map) {
    return Article(
        id: map['id'],
        content: map['content'],
        imageUrl: map['imageUrl'],
        accName: map['accName'],
        commentsCount: map['commentsCount'],
        likesCount: map['likesCount'],
        retweetsCount: map['retweetsCount'],
        send_at: DateTime.parse(map['send_at']));
  }
}
