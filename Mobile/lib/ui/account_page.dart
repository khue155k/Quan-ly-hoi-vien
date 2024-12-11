import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:hoi_vien/ui/change_password.dart';
import 'package:hoi_vien/ui/login_page.dart';

import '../service/auth_service.dart';
import 'company_detail.dart';
import 'membership_fee_page.dart';

class AccountPage extends StatelessWidget {
  final String companyId;
  final String name;
  final String email;

  const AccountPage({
    super.key,
    required this.companyId,
    required this.name,
    required this.email,
  });

  @override
  Widget build(BuildContext context) {
    final authService = AuthService();
    return Scaffold(
      appBar: AppBar(
        title: Text("Tài khoản: $name"),
      ),
      backgroundColor: const Color(0xfff6f6f6),
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 400),
          child: ListView(
            children: [
              _SingleSection(
                children: [
                  _CustomListTile(
                    title: "Thông tin doanh nghiệp",
                    icon: Icons.business,
                    function: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              CompanyDetail(companyId: companyId),
                        ),
                      );
                    },
                  ),
                  _CustomListTile(
                    title: "Hội phí",
                    icon: Icons.paid,
                    function: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              MembershipFeePage(companyId: companyId),
                        ),
                      );
                    },
                  ),
                ],
              ),
              _SingleSection(
                children: [
                  _CustomListTile(
                    title: "Đổi mật khẩu",
                    icon: Icons.lock,
                    function: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ChangePassword(email: email),
                        ),
                      );
                    },
                  ),
                ],
              ),
              _SingleSection(
                children: [
                  _CustomListTile(
                    title: "Đăng xuất",
                    icon: Icons.exit_to_app,
                    function: () {
                      authService.deleteToken();
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const LoginPage(),
                        ),
                      );
                    },
                    trailing: const Icon(null),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CustomListTile extends StatelessWidget {
  final String title;
  final IconData icon;
  final Widget? trailing;
  final void Function()? function;

  const _CustomListTile(
      {required this.title,
      required this.icon,
      this.trailing,
      this.function});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(title),
      leading: Icon(icon),
      trailing: trailing ?? const Icon(CupertinoIcons.forward, size: 18),
      onTap: function,
    );
  }
}

class _SingleSection extends StatelessWidget {
  final String? title;
  final List<Widget> children;

  const _SingleSection({
    // ignore: unused_element
    required this.children, this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ..._getTitle(context, title),
        Container(
          width: double.infinity,
          color: Colors.white,
          child: Column(
            children: children,
          ),
        ),
      ],
    );
  }

  List<Widget> _getTitle(BuildContext context, String? title) {
    if (title != null) {
      return [
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            title.toUpperCase(),
            style:
                Theme.of(context).textTheme.titleMedium?.copyWith(fontSize: 16),
          ),
        ),
      ];
    } else {
      return [
        const SizedBox(height: 16),
      ]; // Return an empty list if title is null
    }
  }
}