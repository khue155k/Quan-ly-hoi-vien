import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:hoi_vien/service/auth_service.dart';
import 'package:http/http.dart' as http;

import '../api_config.dart';

class PostArticlePage extends StatefulWidget {
  const PostArticlePage({super.key});

  @override
  State<PostArticlePage> createState() => _PostArticlePageState();
}

class _PostArticlePageState extends State<PostArticlePage> {
  final TextEditingController contentController = TextEditingController();
  final _authService = AuthService();
  late String companyId;
  late String _token;
  String? imageUrl;

  @override
  void initState() {
    super.initState();
    _getCompanyId();
  }

  _getCompanyId() async {
    _token = await _authService.getToken() ?? "";
    final payload = _authService.decodeToken(_token) ?? {};
    companyId = payload['nameid'];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        //backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(
            Icons.close_rounded,
            color: Colors.black,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: FloatingActionButton.extended(
              elevation: 0,
              onPressed: () async {
                final response = await http.post(
                    Uri.parse('${ApiConfig.baseUrl}/Article/create'),
                    headers: {
                      'Authorization': 'Bearer $_token',
                      'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: jsonEncode({
                      'id': 0,
                      'content': contentController.text,
                      'imageUrl': imageUrl,
                      'company_id': companyId,
                      'commentsCount': 0,
                      'likesCount': 0,
                      'retweetsCount': 0
                    }));
                // debugPrint(response.statusCode.toString());
                // debugPrint(response.headers.toString());
                // debugPrint(_token.toString());

                if (response.statusCode == 201) {
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      return AlertDialog(
                        title: const Text('Thông báo'),
                        content: const Text('Đăng bài thành công'),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.of(context).popUntil((route) => route.isFirst);
                            },
                            child: const Text('OK'),
                          ),
                        ],
                      );
                    },
                  );
                }else{
                  _showAlertDialog("Đăng bài thất bại");
                }
              },
              label: const Text('Đăng bài'),
            ),
          )
        ],
      ),
      body: ListView(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(10, 0, 10, 0),
                child: Icon(
                  Icons.account_circle_rounded,
                  size: 45,
                ),
              ),
              Text(
                'Bài viết công khai.',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(
            height: 20,
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
            child: TextField(
              controller: contentController,
              decoration: InputDecoration(
                hintText: 'Nội dung bài đăng',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(35),
                ),
              ),
              maxLength: 500,
              minLines: 1,
              maxLines: 10,
              style: Theme.of(context).textTheme.titleMedium,
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Link ảnh (nếu có)',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(35),
                ),
              ),
              maxLength: 200,
              minLines: 1,
              maxLines: 10,
              style: Theme.of(context).textTheme.titleMedium,
              onChanged: (value) {
                setState(() {
                  imageUrl = value;
                });
              },
            ),
          ),
          const SizedBox(
            height: 20,
          ),
          const Divider(
            thickness: 2,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              CustomIconButton(
                buttonFuncion: () {},
                iconSymbol: Icons.image,
              ),
              CustomIconButton(
                buttonFuncion: () {},
                iconSymbol: Icons.camera_alt_outlined,
              ),
              CustomIconButton(
                buttonFuncion: () {},
                iconSymbol: Icons.voice_chat,
              ),
              CustomIconButton(
                buttonFuncion: () {},
                iconSymbol: Icons.notifications_active,
              ),
            ],
          ),
          const Divider(
            thickness: 2,
          ),
          if (imageUrl != null)
            Image.network(
              imageUrl!,
              fit: BoxFit.cover,
              height: 200,
              width: double.infinity,
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) {
                  return child;
                } else {
                  return Center(
                    child: CircularProgressIndicator(
                      value: loadingProgress.expectedTotalBytes != null
                          ? loadingProgress.cumulativeBytesLoaded /
                              (loadingProgress.expectedTotalBytes ?? 1)
                          : null,
                    ),
                  );
                }
              },
              errorBuilder: (context, error, stackTrace) {
                return const Center(
                    child: Icon(Icons.error, color: Colors.red));
              },
            ),
        ],
      ),
    );
  }
  void _showAlertDialog(String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Thông báo'),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
}

class CustomIconButton extends StatelessWidget {
  final VoidCallback buttonFuncion;
  final IconData iconSymbol;

  const CustomIconButton({
    super.key,
    required this.buttonFuncion,
    required this.iconSymbol,
  });

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: buttonFuncion,
      icon: Icon(
        iconSymbol,
        color: Theme.of(context).primaryColor,
        size: 35,
      ),
    );
  }
}
