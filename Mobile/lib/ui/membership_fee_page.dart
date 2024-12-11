import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

import '../api_config.dart';

class MembershipFeePage extends StatefulWidget {
  final String companyId;

  const MembershipFeePage({super.key, required this.companyId});

  @override
  State<MembershipFeePage> createState() => _MembershipFeePageState();
}

class _MembershipFeePageState extends State<MembershipFeePage> {
  bool _isLoading = false;
  final List _membershipFeeList = [];
  int _currentPage = 1;
  final int _pageSize = 10;
  int? _totalItem;
  late ScrollController _sc;

  @override
  void initState() {
    super.initState();
    _fetchMembershipFee();

    _sc = ScrollController();
    _sc.addListener(() {
      if (_sc.position.pixels == _sc.position.maxScrollExtent) {
        _fetchMembershipFee();
      }
    });
  }

  @override
  void dispose() {
    _sc.dispose();
    super.dispose();
  }

  Future<void> _fetchMembershipFee() async {
    if (_totalItem != null && _membershipFeeList.length == _totalItem) return;
    if (!_isLoading) {
      setState(() {
        _isLoading = true;
      });

      final response = await http.get(Uri.parse(
          '${ApiConfig.baseUrl}/Fee/list-fee-company/${widget.companyId}?pageNumber=$_currentPage&pageSize=$_pageSize'));

      if (response.statusCode == 200) {
        final resBody = json.decode(response.body);
        _membershipFeeList.addAll(resBody['fees']);

        _totalItem = resBody['totalCount'];
        _currentPage++;
      }

      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        title: const Text("Thông tin hội phí"),
      ),
      body: _membershipFeeList.isEmpty
          ? const Center(
              child: Text('Không tìm thấy thông tin hội phí.',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)))
          : ListView.builder(
              controller: _sc,
              padding: const EdgeInsets.symmetric(vertical: 8.0),
              itemCount: _membershipFeeList.length + 1,
              itemBuilder: (BuildContext context, int index) {
                if (index == _membershipFeeList.length) {
                  return _buildProgressIndicator();
                }
                var fee = _membershipFeeList[index];

                return Card(
                  margin: const EdgeInsets.symmetric(
                      vertical: 8.0, horizontal: 16.0),
                  elevation: 4,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        Text(
                          "Năm: ${fee['nam']}",
                          style:
                              Theme.of(context).textTheme.titleLarge?.copyWith(
                                    color: const Color.fromRGBO(74, 77, 84, 1),
                                    fontSize: 20.0,
                                    fontWeight: FontWeight.w800,
                                  ),
                        ),
                        const SizedBox(height: 6.0),
                        getItemRow(
                            "Hội phí",
                            NumberFormat.currency(
                                    locale: 'vi_VN', symbol: 'VNĐ')
                                .format(fee['hoiPhi'])
                                .toString(),
                            context),
                        getItemRow("Trạng thái", fee['trangThai'], context),
                        if (fee['hinhThucDong'] != null) ...[
                          getItemRow(
                              "Hình thức đóng", fee['hinhThucDong'], context),
                          getItemRow(
                              "Ngày đóng",
                              DateFormat('dd/MM/yyyy')
                                  .format(DateTime.parse(fee['ngayDong']))
                                  .toString(),
                              context),
                        ]
                      ],
                    ),
                  ),
                );
              }),
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
