/* eslint no-underscore-dangle: 0 */
import StackScrollTool from './StackScrollTool.js';
import scroll from '../util/scroll.js';

jest.mock('../util/scroll.js');

const mockEvent = {
  detail: {
    direction: 1,
    element: {},
    deltaPoints: {
      page: {
        y: 5,
      },
    },
  },
};

describe('StachScroll.js', () => {
  describe('default values', () => {
    it('has a default name of "StackScroll"', () => {
      const defaultName = 'StackScroll';
      const instantiatedTool = new StackScrollTool();

      expect(instantiatedTool.name).toEqual(defaultName);
    });

    it('can be created with a custom tool name', () => {
      const customToolName = { name: 'customToolName' };
      const instantiatedTool = new StackScrollTool(customToolName);

      expect(instantiatedTool.name).toEqual(customToolName.name);
    });

    it('should have default configuration loop as false', () => {
      const instantiatedTool = new StackScrollTool();

      expect(instantiatedTool.configuration.loop).toEqual(false);
    });

    it('should have default configuration allowSkipping as true', () => {
      const instantiatedTool = new StackScrollTool();

      expect(instantiatedTool.configuration.allowSkipping).toEqual(true);
    });

    it('should have default configuration invert as false', () => {
      const instantiatedTool = new StackScrollTool();

      expect(instantiatedTool.configuration.invert).toEqual(false);
    });
  });

  describe('_dragCallback', () => {
    let instantiatedTool;

    beforeEach(() => {
      instantiatedTool = new StackScrollTool();

      instantiatedTool._getDeltaY = jest.fn();
      instantiatedTool._getPixelPerImage = jest.fn();

      scroll.mockClear();
    });

    it('should change image in case drag variation on Y is bigger than image pixels devided by images', () => {
      instantiatedTool._getDeltaY.mockReturnValue(600);
      instantiatedTool._getPixelPerImage.mockReturnValue(100);

      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).toHaveBeenCalled();
    });

    it('should NOT change image in case drag variation on Y is smaller than image pixels devided by images', () => {
      instantiatedTool._getDeltaY.mockReturnValue(100);
      instantiatedTool._getPixelPerImage.mockReturnValue(600);

      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).not.toHaveBeenCalled();
    });

    it('should call scroll with positive index when DeltaY is positive and invert is set to false', () => {
      instantiatedTool._getDeltaY.mockReturnValue(600);
      instantiatedTool._getPixelPerImage.mockReturnValue(100);

      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).toHaveBeenCalledWith({}, 6, false, true);
    });

    it('should call scroll with negative index when DeltaY is negative and invert is set to false', () => {
      instantiatedTool._getDeltaY.mockReturnValue(-600);
      instantiatedTool._getPixelPerImage.mockReturnValue(100);

      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).toHaveBeenCalledWith({}, -6, false, true);
    });

    it('should call scroll with negative index when DeltaY is positive and invert is set to true', () => {
      instantiatedTool = new StackScrollTool({
        configuration: { invert: true },
      });
      instantiatedTool._getDeltaY = jest.fn();
      instantiatedTool._getPixelPerImage = jest.fn();
      scroll.mockClear();

      instantiatedTool._getDeltaY.mockReturnValue(600);
      instantiatedTool._getPixelPerImage.mockReturnValue(100);
      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).toHaveBeenCalledWith({}, -6, false, true);
    });

    it('should call scroll with positive index when DeltaY is negative and invert is set to true', () => {
      instantiatedTool = new StackScrollTool({
        configuration: { invert: true },
      });
      instantiatedTool._getDeltaY = jest.fn();
      instantiatedTool._getPixelPerImage = jest.fn();
      scroll.mockClear();

      instantiatedTool._getDeltaY.mockReturnValue(-600);
      instantiatedTool._getPixelPerImage.mockReturnValue(100);
      instantiatedTool._dragCallback(mockEvent);

      expect(scroll).toHaveBeenCalledWith({}, 6, false, true);
    });
  });
});
