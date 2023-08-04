import logo from './textures/logo.jpg';
import endscreen_logo from '../data/textures/endscreen_logo.jpg';
import ref_image from '../data/textures/ref_image.jpg';

import sound_bg from '../data/audio/sound_bg.mp3';
import sound_final from '../data/audio/sound_final.mp3';

export default class ConfigurableParams {

  static data = {
    "general": {
      "playable_name": {
        "label": "Playable name",
        "type": "string",
        "value": "Dashboard Template",
        "descrition": "Needed to generate a filename.",
        "assetName": null
      },
      "version": {
        "label": "Version of playable",
        "type": "float",
        "value": "1.0",
        "descrition": "Needed to generate a filename.",
        "assetName": null
      },
      "cbpn": {
        "label": "CB or PN version",
        "type": "select",
        "value": "PN",
        "options": ["CB", "PN"],
        "descrition": "CB (with auto redirect to the store in end of game) or \"Play Now\" (without auto redirect, in the end of the game, user will see \"end card\").",
        "assetName": null
      },
      "show_playnow": {
        "label": "Show \"PLAY NOW\" for all platforms",
        "type": "boolean",
        "value": true,
        "descrition": "If you want to show \"PLAY NOW\" button for all platforms, please set this switcher to enable.",
        "assetName": null
      },
      "message": {
        "label": "",
        "type": "message",
        "value": "In this version of the playable for PN, the \"PLAY NOW\" button visible only for mintegral. If you want to show button for all platforms, please set the switcher above to enable.",
        "descrition": "",
        "assetName": null
      }

    },
    "settings": {
      "background_color": {
        "label": "Background color",
        "type": "color",
        "value": "#86D8F9",
        "descrition": "Background color.",
        "assetName": null
      }
    },
    "top_text": {
      "show": {
        "label": "Show top title",
        "type": "boolean",
        "value": true,
        "descrition": "Show top title.",
        "assetName": null
      },
      "top_title_text": {
        "label": "Top title text",
        "type": "string",
        "value": "TOP TEXT",
        "descrition": "Top title text.",
        "assetName": null
      },
      "top_title_text_color": {
        "label": "Top title text color",
        "type": "color",
        "value": "#ffffff",
        "descrition": "Top title text color.",
        "assetName": null
      },
      "top_title_stroke_color": {
        "label": "Top title text stroke color",
        "type": "color",
        "value": "#000000",
        "descrition": "Top title text stroke color.",
        "assetName": null
      },
      "top_title_stroke_thickness": {
        "label": "Top title text stroke thickness",
        "type": "number",
        "value": "0",
        "descrition": "Top title text stroke thickness.",
        "assetName": null
      },
      "top_title_bg_color": {
        "label": "Top title background color",
        "type": "color",
        "value": "#000000",
        "descrition": "Top title background color.",
        "assetName": null
      },
      "top_title_bg_alpha": {
        "label": "Top title background alpha",
        "type": "number",
        "value": "0.5",
        "descrition": "Top title background alpha.",
        "assetName": null
      },
      "top_title_offset": {
        "label": "Top title offset top",
        "type": "number",
        "value": "0",
        "descrition": "Top title offset top.",
        "assetName": null
      }
    },
    "clay": {
      "clay1": {
        "label": "Clay1 color",
        "type": "color",
        "value": "#c97c5d",
        "descrition": "Clay1 color.",
        "assetName": null
      },
      "clay2": {
        "label": "Clay2 color",
        "type": "color",
        "value": "#eed7c5",
        "descrition": "Clay2 color.",
        "assetName": null
      },
      "clay3": {
        "label": "Clay3 color",
        "type": "color",
        "value": "#c89f9c",
        "descrition": "Clay3 color.",
        "assetName": null
      },
    },
    "character": {
      "select_character": {
        "label": "Select Character",
        "type": "select",
        "value": "Bride",
        "options": ["Big", "Bride", "Harley", "Tuxedo"],
        "descrition": "Select character.",
        "assetName": null
      },
    },
    "reference_photo": {
      "ref_photo_enabled": {
        "label": "Reference photo enabled",
        "type": "boolean",
        "value": false,
        "descrition": "Reference photo enabled.",
        "assetName": null
      },
      "ref_photo": {
        "label": "Reference photo image",
        "type": "img",
        "value": ref_image,
        "descrition": "Please upload the image. The image resolution must be no more than 2048x2048 pixels. And also remember about the size. Please make sure that your html file is no larger than 2 MB.",
        "assetName": "ref_image"
      },
      "scale": {
        "label": "Scale of the ref image",
        "type": "float",
        "value": "1.0",
        "descrition": "Scale of the ref image.",
        "assetName": null
      },
      "offset": {
        "label": "Offset of the ref photo",
        "type": "vector2",
        "x": "20",
        "y": "20",
        "descrition": "Offset of the ref photo.",
        "assetName": null
      },
      "rotation": {
        "label": "Ref photo rotation(deg)",
        "type": "number",
        "value": "0",
        "descrition": "Ref photo rotation(deg).",
        "assetName": null
      }
    },
    "hint": {
      "starting_hint_type": {
        "label": "Starting Hint type",
        "type": "select",
        "value": "ORIGINAL",
        "options": ["ORIGINAL", "MICKEY", "SIMPLE", "NONE"],
        "descrition": "Select tarting hint type.",
        "assetName": null
      },
    },
    "play_button": {
      "btn_color_main": {
        "label": "Main color of the button",
        "type": "color",
        "value": "#30EB58",
        "descrition": "Main color of the button.",
        "assetName": null
      },
      "btn_color_dark": {
        "label": "Shade color of the button",
        "type": "color",
        "value": "#1EA842",
        "descrition": "Shade color of the button.",
        "assetName": null
      },
      "play_now_text": {
        "label": "Play Now button text",
        "type": "string",
        "value": "PLAY NOW",
        "descrition": "Ingame Play Now button text.",
        "assetName": null
      }
    },
    "logo_for_google": {
      "change_logo": {
        "label": "Logo",
        "type": "img",
        "value": logo,
        "descrition": "Please upload the image. The image resolution must be no more than 2048x2048 pixels. And also remember about the size. Please make sure that your html file is no larger than 2 MB.",
        "assetName": "logo"
      }
    },
    "endcard": {
      "logo": {
        "label": "Logo",
        "type": "img",
        "value": endscreen_logo,
        "descrition": "Please upload the image. The image resolution must be no more than 2048x2048 pixels. And also remember about the size. Please make sure that your html file is no larger than 2 MB.",
        "assetName": "endscreen_logo"
      },
      "logo_scale": {
        "label": "Scale of the logo",
        "type": "float",
        "value": "1.0",
        "descrition": "Scale of the logo.",
        "assetName": null
      },
      "button_text": {
        "label": "Endscreen button text",
        "type": "string",
        "value": "PLAY NOW",
        "descrition": "Endscreen button text.",
        "assetName": null
      },
      "show_text": {
        "label": "Show text on endscreen",
        "type": "boolean",
        "value": false,
        "descrition": "Show text on endscreen.",
        "assetName": null
      },
      "text": {
        "label": "Endscreen text",
        "type": "string",
        "value": "WINNER!",
        "descrition": "Endscreen text",
        "assetName": null
      },
      "text_color": {
        "label": "Endscreen text color",
        "type": "color",
        "value": "#ffffff",
        "descrition": "Endscreen text color.",
        "assetName": null
      },
      "bg_type": {
        "label": "Background type",
        "type": "select",
        "value": "BLUR",
        "options": ["BLUR", "GRADIENT"],
        "descrition": "Select background type.",
        "assetName": null
      },
      "gradient_color_top": {
        "label": "Gradient background top color",
        "type": "color",
        "value": "#CEB8FF",
        "descrition": "Gradient background top color.",
        "assetName": null
      },
      "gradient_color_bottom": {
        "label": "Gradient background bottom color",
        "type": "color",
        "value": "#FFC6FD",
        "descrition": "Gradient background bottom color.",
        "assetName": null
      }
    },
    "audio": {
      "sound_bg": {
        "label": "Looped background music .mp3",
        "type": "sound",
        "value": sound_bg,
        "descrition": "Looped background music .mp3",
        "assetName": "sound_bg"
      },
      "sound_bg_enabled": {
        "label": "Background music enabled",
        "type": "boolean",
        "value": true,
        "descrition": "Background music enabled.",
        "assetName": null
      },
      "sound_final": {
        "label": "Sound on finish .mp3",
        "type": "sound",
        "value": sound_final,
        "descrition": "Sound on finish",
        "assetName": "sound_final"
      },
      "sound_final_enabled": {
        "label": "Sound on finish enabled",
        "type": "boolean",
        "value": true,
        "descrition": "Sound on finish enabled.",
        "assetName": null
      }
    },
    "market_details": {
      "go_to_market_after_x_click": {
        "label": "Go To Market After x Click",
        "type": "number",
        "value": "0",
        "min": "0",
        "max": "15",
        "descrition": "Please select the number of clicks after which the user will go to the store.",
        "assetName": null
      },
      "go_to_market_after_x_time": {
        "label": "Go To Market After x Time",
        "type": "number",
        "value": "0",
        "min": "0",
        "max": "60",
        "descrition": "Please select the time after which the user will go to the store.",
        "assetName": null
      }
    },
    "store_link": {
      "android": {
        "label": "Android Link",
        "type": "link",
        "value": "https://play.google.com/store/apps/details?id=com.engineerbrainfart.buffetboss",
        "descrition": "Please insert Google Play Store link. This link used only in Unity, AdColony, AppLovin, Chartboost.",
        "assetName": null
      },
      "ios": {
        "label": "iOS Link",
        "type": "link",
        "value": "https://apps.apple.com/app/id1641250955",
        "descrition": "Please insert App Store link. This link used only in Unity, AdColony, AppLovin, Chartboost.",
        "assetName": null
      }
    }
  }

  static getData() {
    return JSON.parse(JSON.stringify(this.data));
  }

  static isCB() {
    return JSON.parse(JSON.stringify(this.data))["general"]["cbpn"]["value"] === "CB" ? true : false;
  }

  static isPN() {
    return JSON.parse(JSON.stringify(this.data))["general"]["cbpn"]["value"] === "PN" ? true : false;
  }

  static isNeedShowPN() {
    return this.isPN() && JSON.parse(JSON.stringify(this.data))["general"]["show_playnow"]["value"] ? true : false;
  }

  static isXMoney() {
    return Number(JSON.parse(JSON.stringify(this.data))["market_details"]["go_to_market_after_x_money"]["value"]) > 0 ? true : false;
  }

  static isXClick() {
    return Number(JSON.parse(JSON.stringify(this.data))["market_details"]["go_to_market_after_x_click"]["value"]) > 0 ? true : false;
  }

  static isXTime() {
    return Number(JSON.parse(JSON.stringify(this.data))["market_details"]["go_to_market_after_x_time"]["value"]) > 0 ? true : false;
  }
}