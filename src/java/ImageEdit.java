import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageEdit {
    public static void main(String[] args) {

        if (args.length==0) {
            System.out.println("ImageEdit <concat|flipframes>");
            return;
        }

        if ("concat".equalsIgnoreCase(args[0])) {
            if (args.length < 4) {
                System.out.println("ImageEdit concat <first image> <second image> <output image>");
                return;
            }

            String inputImagePath = args[1];
            String inputImagePath2 = args[2];
            String outputImagePath = args[3];

            try {
                BufferedImage inputImage = ImageIO.read(new File(inputImagePath));
                BufferedImage inputImage2 = ImageIO.read(new File(inputImagePath2));

                // Create a new image with double width
                BufferedImage outputImage = new BufferedImage(inputImage.getWidth() + inputImage2.getWidth(),
                        inputImage.getHeight(), BufferedImage.TYPE_INT_RGB);

                // Copy the original image to the left half of the new image
                Graphics2D graphics = outputImage.createGraphics();
                graphics.drawImage(inputImage, 0, 0, null);

                // Copy the original image to the right half of the new image
                graphics.drawImage(inputImage2, inputImage.getWidth(), 0, null);
                graphics.dispose();

                // Save the output image
                ImageIO.write(outputImage, "png", new File(outputImagePath));

                System.out.println("Image concatenation complete. Output saved to: " + outputImagePath);
            } catch (IOException e) {
                System.out.println("Error occurred while processing the image: " + e.getMessage());
            }
        }else if( "flipframes".equalsIgnoreCase(args[0])){

            if (args.length < 5) {
                System.out.println("ImageEdit flipframes <source image> <horiz|vert> <image width> <output image>");
                return;
            }            

            String inputImagePath = args[1];
            String flipDirection = args[2];
            int frameWidth = Integer.parseInt(args[3]);
            String outputImagePath = args[4];

            System.out.println("input image: " + inputImagePath);
            System.out.println("flipDirection: " + flipDirection);
            System.out.println("frameWidth: " + frameWidth);
            System.out.println("outputImagePath: " + outputImagePath);

            try{
            BufferedImage inputImage = ImageIO.read(new File(inputImagePath));
            //originalImage.getSubimage(x, y, width, height);
            BufferedImage croppedImage;// = cropImage(originalImage, x, y, width, height);

            // Create a new image with double width
            BufferedImage outputImage = new BufferedImage(inputImage.getWidth(),
                    inputImage.getHeight(), BufferedImage.TYPE_INT_RGB);

            // Copy the original image to the left half of the new image
            Graphics2D graphics = outputImage.createGraphics();
            if(inputImage.getWidth()==frameWidth || frameWidth==0)
                graphics.drawImage(inputImage, 0 + inputImage.getWidth(), 0, -1 * inputImage.getWidth(), inputImage.getHeight(), null);
            else if(inputImage.getWidth()/frameWidth >1){ //Its an exact multiple of the specified flip width
                int x=0;
                int i=0;
                int totalFrames = inputImage.getWidth()/frameWidth;
                int width=0;
                System.out.println("total frames=" + totalFrames );
                //while(x<inputImage.getWidth()){
                while(i<=totalFrames-1){                    
                    System.out.println( "x=" + x);
                    if(x>inputImage.getWidth()-frameWidth){
                        x=inputImage.getWidth()-frameWidth;
                    }                    
                    System.out.println( "cropping image at x=" + x + ",y=" + 0 + ",width="+frameWidth+",height="+inputImage.getHeight());
                    croppedImage = inputImage.getSubimage(x,0,frameWidth,inputImage.getHeight());
                    graphics.drawImage(croppedImage,x + frameWidth,0,-1 * frameWidth,croppedImage.getHeight(),null);
                    x+=frameWidth-1;
                    i++;
                }
            }

            // Copy the original image to the right half of the new image
            //graphics.drawImage(inputImage2, inputImage.getWidth(), 0, null);
            graphics.dispose();

            // Save the output image
            ImageIO.write(outputImage, "png", new File(outputImagePath));

            System.out.println("Image concatenation complete. Output saved to: " + outputImagePath);
            }catch (IOException e) {
                System.out.println("Error occurred while processing the image: " + e.getMessage());
            }
        }

    }
}
