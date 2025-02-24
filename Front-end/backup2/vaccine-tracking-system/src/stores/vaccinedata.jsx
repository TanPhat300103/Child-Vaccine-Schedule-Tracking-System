export const agepackage = [
  {
    id: "package1",
    name: "Gói trẻ em từ 0-2 tuổi",
    details: [
      {
        disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B",
        vaccine: "HEXAXIM",
        country: "Pháp",
        doses: 3,
      },
      { disease: "Rota virus", vaccine: "ROTARIX", country: "Bỉ", doses: 2 },
    ],
  },
  {
    id: "package2",
    name: "Gói tiền học đường từ 3-9 tuổi",
    details: [
      {
        disease:
          "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
        vaccine: "PREVENAR 13",
        country: "Bỉ",
        doses: 1,
      },
      {
        disease: "Cúm mùa",
        vaccine: "VAXIGRIP TETRA",
        country: "Pháp",
        doses: 1,
      },
    ],
  },
  {
    id: "package3",
    name: "Gói thanh thiếu niên từ 9-18 tuổi",
    details: [
      {
        disease: "Ung Thư do Vi Rút HPV",
        vaccine: "GARDASIL 9",
        country: "Mỹ",
        doses: 3,
      },
      {
        disease: "Viêm não Nhật Bản",
        vaccine: "IMOJEV",
        country: "Thái Lan",
        doses: 1,
      },
    ],
  },
];

export const pricepackage = [
  {
    disease: "Bạch hầu, ho gà, uốn ván, bại liệt, Hib, viêm gan B",
    vaccines: [
      { name: "HEXAXIM", country: "Pháp", price: "995.000đ" },
      { name: "INFANRIX HEXA", country: "Bỉ", price: "995.000đ" },
    ],
  },
  {
    disease: "Rota virus",
    vaccines: [
      { name: "ROTARIX", country: "Bỉ", price: "815.000đ" },
      { name: "ROTAVIN", country: "Việt Nam", price: "480.000đ" },
      { name: "ROTATEQ", country: "Mỹ", price: "655.000đ" },
    ],
  },
  {
    disease: "Các bệnh do phế cầu (Viêm phổi, Viêm tai giữa, Viêm màng não)",
    vaccines: [
      { name: "SYNFLORIX", country: "Bỉ", price: "1.024.000đ" },
      { name: "PREVENAR 13", country: "Bỉ", price: "1.280.000đ" },
      { name: "PNEUMOVAX 23", country: "Mỹ", price: "1.440.000đ" },
    ],
  },
  {
    disease: "Cúm mùa",
    vaccines: [
      { name: "IVACFLU-S 0,5ML", country: "Việt Nam", price: "260.000đ" },
      { name: "VAXIGRIP TETRA", country: "Pháp", price: "333.000đ" },
      { name: "INFLUVAC TETRA", country: "Hà Lan", price: "333.000đ" },
    ],
  },
  {
    disease: "Ung Thư do Vi Rút HPV",
    vaccines: [
      { name: "GARDASIL 9", country: "Mỹ", price: "2.940.000đ" },
      { name: "GARDASIL 4", country: "Mỹ", price: "1.780.000đ" },
    ],
  },
  {
    disease: "Viêm não Nhật Bản",
    vaccines: [
      { name: "JEVAX 1ML", country: "Việt Nam", price: "175.000đ" },
      { name: "IMOJEV", country: "Thái Lan", price: "830.000đ" },
      { name: "JEEV 3MCG 0,5 ML", country: "Ấn Độ", price: "279.000đ" },
    ],
  },
];
