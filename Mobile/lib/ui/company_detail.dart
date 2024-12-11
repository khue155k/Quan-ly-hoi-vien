import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../api_config.dart';

class CompanyDetail extends StatefulWidget {
  final String companyId;

  const CompanyDetail({super.key, required this.companyId});

  @override
  State<CompanyDetail> createState() => _CompanyDetailState();
}

class _CompanyDetailState extends State<CompanyDetail> {
  bool _isLoading = true;
  Map<String, dynamic>? _companyData;

  @override
  void initState() {
    super.initState();
    _fetchCompanyDetail();
  }

  Future<void> _fetchCompanyDetail() async {
    final response = await http
        .get(Uri.parse('${ApiConfig.baseUrl}/Company/${widget.companyId}'));

    if (response.statusCode == 200) {
      setState(() {
        _companyData = json.decode(response.body);
        _isLoading = false;
      });
    } else {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Thông tin doanh nghiệp"),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _companyData == null
              ? const Center(
                  child: Text('Không tìm thấy thông tin doanh nghiệp.',
                      style:
                          TextStyle(fontSize: 20, fontWeight: FontWeight.bold)))
              : SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Card(
                        margin: const EdgeInsets.symmetric(
                          vertical: 8.0,
                          horizontal: 16.0,
                        ),
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8.0,
                            horizontal: 16.0,
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Tên doanh nghiệp: ${_companyData!['ten_doanh_nghiep']}",
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(
                                      color:
                                          const Color.fromRGBO(74, 77, 84, 1),
                                      fontSize: 20.0,
                                      fontWeight: FontWeight.w800,
                                    ),
                              ),
                              const SizedBox(
                                height: 6.0,
                              ),
                              getItemRow(
                                  "Mã số thuế", _companyData!['mst'], context),
                              getItemRow(
                                  "Địa chỉ", _companyData!['diachi'], context),
                              getItemRow("Số điện thoại",
                                  _companyData!['so_dt'], context),
                              getItemRow(
                                  "Zalo", _companyData!['zalo'], context),
                              getItemRow(
                                  "Email", _companyData!['email'], context),
                              getItemRow(
                                  "Website", _companyData!['website'], context),
                              getItemRow("Thành lập vào",
                                  _companyData!['created_at'], context),
                            ],
                          ),
                        ),
                      ),
                      Card(
                        margin: const EdgeInsets.symmetric(
                          vertical: 8.0,
                          horizontal: 16.0,
                        ),
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8.0,
                            horizontal: 16.0,
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Tên người đại diện: ${_companyData!['hoten_ndd']}",
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(
                                      color:
                                          const Color.fromRGBO(74, 77, 84, 1),
                                      fontSize: 20.0,
                                      fontWeight: FontWeight.w800,
                                    ),
                              ),
                              const SizedBox(
                                height: 6.0,
                              ),
                              getItemRow("Chức vụ", _companyData!['chucvu_ndd'],
                                  context),
                              getItemRow("Ngày sinh",
                                  _companyData!['ngay_sinh_ndd'], context),
                              getItemRow("Số điện thoại",
                                  _companyData!['so_dt_ndd'], context),
                              getItemRow(
                                  "Zalo", _companyData!['zalo_ndd'], context),
                              getItemRow(
                                  "Email", _companyData!['email_ndd'], context),
                            ],
                          ),
                        ),
                      ),
                      Card(
                        margin: const EdgeInsets.symmetric(
                          vertical: 8.0,
                          horizontal: 16.0,
                        ),
                        elevation: 4,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8.0,
                            horizontal: 16.0,
                          ),
                          child: Column(
                            mainAxisSize: MainAxisSize.max,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Tên người liên hệ: ${_companyData!['hoten_nlh']}",
                                style: Theme.of(context)
                                    .textTheme
                                    .titleLarge
                                    ?.copyWith(
                                      color:
                                          const Color.fromRGBO(74, 77, 84, 1),
                                      fontSize: 20.0,
                                      fontWeight: FontWeight.w800,
                                    ),
                              ),
                              const SizedBox(height: 6.0),
                              getItemRow("Chức vụ", _companyData!['chucvu_nlh'],
                                  context),
                              getItemRow("Ngày sinh",
                                  _companyData!['ngay_sinh_nlh'], context),
                              getItemRow("Số điện thoại",
                                  _companyData!['so_dt_nlh'], context),
                              getItemRow(
                                  "Zalo", _companyData!['zalo_nlh'], context),
                              getItemRow(
                                  "Email", _companyData!['email_nlh'], context),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget getItemRow(String title, String? value, BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "$title: ",
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontSize: 16.0,
                ),
          ),
          Expanded(
            child: Text(
              value ?? "",
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontSize: 16.0,
                  ),
              overflow: TextOverflow.visible,
            ),
          ),
        ],
      ),
    );
  }
}
