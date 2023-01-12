import { RectBound } from '../../types/rectBound.type';
import { CommonConfig } from '../config/commonConfig';

export class ObjectUtil {
  static calRectField(
    width: number,
    height: number
  ): RectBound {
    return {
      left: 0 + width * 0.5,
      bottom: 0 + height * 0.5,
      right: CommonConfig.FIELD_WIDTH - width * 0.5,
      top: CommonConfig.FIELD_HEIGHT - height * 0.5,
    };
  }
}
