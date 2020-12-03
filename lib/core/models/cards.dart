// To parse this JSON data, do
//
//     final cardsModel = cardsModelFromJson(jsonString);

import 'dart:convert';

Map<String, CardsModel> cardsModelFromJson(String str) =>
    Map.from(json.decode(str))
        .map((k, v) => MapEntry<String, CardsModel>(k, CardsModel.fromJson(v)));

String cardsModelToJson(Map<String, CardsModel> data) => json.encode(
    Map.from(data).map((k, v) => MapEntry<String, dynamic>(k, v.toJson())));

class CardsModel {
  CardsModel({
    this.cardActive,
    this.initialURL,
    this.isWebCard,
    this.requireAuth
  });
  
  bool cardActive;
  String initialURL;
  bool isWebCard;
  bool requireAuth;

  factory CardsModel.fromJson(Map<String, dynamic> json) => CardsModel(
        cardActive: json["cardActive"] == null ? null : json["cardActive"],
        initialURL: json["initialURL"] == null ? null : json["initialURL"],
        isWebCard: json["isWebCard"] == null ? null : json["isWebCard"],
        requireAuth: json["requireAuth"] == null ? null : json["requireAuth"],
      );

  Map<String, dynamic> toJson() => {
        "cardActive": cardActive == null ? null : cardActive,
        "initialURL": initialURL == null ? null : initialURL,
        "isWebCard": isWebCard == null ? null : isWebCard,
        "requireAuth": requireAuth == null ? null : requireAuth,
      };
}
