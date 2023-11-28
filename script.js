var place_data=[
  {
   tag: "taipei_city",
   place: "臺北市",
   population:"17,058",
  },

  {
   tag: "new_taipei_city",
   place: "新北市",
  population:"58,270",
  },

  {
   tag: "taichung_city",
   place: "台中市",
 population:"37,375",
  },

  {
   tag: "tainan_city",
   place: "臺南市",
 population:"9,138",
  },

  {
   tag: "kaohsiung_city",
   place: "高雄市",
 population:"37,004",
  },

  {
   tag: "keelung_city",
   place: "基隆市",
 population:"9,512",
  },

  {
   tag: "taoyuan_country",
   place: "桃園市",
 population:"81,654",
  },

  {
   tag: "hsinchu_city",
   place: "新竹市",
 population:"4,540",
  },

  {
   tag: "hsinchu_country",
   place: "新竹縣",
 population:"22,281",
  },

  {
   tag: "miaoli_country",
   place: "苗栗縣",
 population:"11,546",
  },

  {
   tag: "changhua_country",
   place: "彰化縣",
 population:"6,313",
  },

  {
   tag: "nantou_country",
   place: "南投縣",
 population:"29,454",
  },

  {
   tag: "yunlin_country",
   place: "雲林縣",
 population:"2,798",
  },

  {
   tag: "chiayi_city",
   place: "嘉義市",
 population:"1,238",
  },

  {
   tag: "chiayi_country",
   place: "嘉義縣",
 population:"6,012",
  },

  {
   tag: "pingtung_country",
   place: "屏東縣",
 population:"61,211",
  },

  {
   tag: "yilan_country",
   place: "宜蘭縣",
 population:"18,196",
  },

  {
   tag: "hualien_country",
   place: "花蓮縣",
 population:"93,335",
  },

  {
   tag: "taitung_country",
   place: "台東縣",
 population:"78,262",
  },

  {
   tag: "penghu_country",
   place: "澎湖縣",
 population:"697",
  },

  {
   tag: "kinmen_country",
   place: "金門縣",
 population:"1,271",
  },

  {
   tag: "lienchiang_country",
   place: "連江縣",
  population:"317",
  },
]
;
var vm = new Vue({
      el: "#app",
      data: {
        filter: "",
        place_data: place_data,
      },
      computed: {
        now_area: function () {
          var vobj = this;
          var result = this.place_data.filter(function (obj) {
            return obj.tag == vobj.filter;
          });
          if (result.length == 0) {
            return null;
          }
          return result[0];
        },
      },
      methods: {
        drawDensityMap: function () {
          var canvas = document.getElementById("densityMap");
          var ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // 獲取總人口數，用於計算人口密度
          var totalPopulation = this.place_data.reduce(function (total, area) {
            return total + parseInt(area.population.replace(",", ""));
          }, 0);

          this.place_data.forEach(function (area) {
            var population = parseInt(area.population.replace(",", ""));
            var density = population / totalPopulation;

            var pathElement = document.querySelector('[data-name="' + area.tag + '"]');
            if (pathElement) {
              var boundingBox = pathElement.getBoundingClientRect();
              var x = boundingBox.left + window.scrollX;
              var y = boundingBox.top + window.scrollY;

              ctx.fillStyle = `rgba(0, 128, 0, ${density})`;
              ctx.fillRect(x, y, boundingBox.width, boundingBox.height);
            }
          });
        },
      },
      mounted: function () {
        this.drawDensityMap();
      },
    });

    $("path").mouseenter(function (e) {
      var tagname = $(this).attr("data-name");
      vm.filter = tagname;
      vm.drawDensityMap();
    });