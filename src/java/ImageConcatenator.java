import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

public class ImageConcatenator {
    public static void main(String[] args) {
        if(args.length<3){
            System.out.println("ImageConcatenator <first image> <second image> <output image>");
            return;
        }

        String inputImagePath = args[0];
        String inputImagePath2 = args[1];
        String outputImagePath = args[2];

        try {
            BufferedImage inputImage = ImageIO.read(new File(inputImagePath));
            BufferedImage inputImage2 = ImageIO.read(new File(inputImagePath2));

            // Create a new image with double width
            BufferedImage outputImage = new BufferedImage(inputImage.getWidth() + inputImage2.getWidth(), inputImage.getHeight(), BufferedImage.TYPE_INT_RGB);

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
    }
}
