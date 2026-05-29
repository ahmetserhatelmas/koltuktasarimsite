export type SocialPlatform = "instagram" | "facebook" | "x" | "linkedin" | "youtube"

export type SocialLink = {
  platform: SocialPlatform
  url: string
}

export const SOCIAL_PLATFORMS: {
  platform: SocialPlatform
  key: string
  label: string
  placeholder: string
}[] = [
  {
    platform: "instagram",
    key: "social_instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/koltukdunyasi",
  },
  {
    platform: "facebook",
    key: "social_facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/koltukdunyasi",
  },
  {
    platform: "x",
    key: "social_x",
    label: "X (Twitter)",
    placeholder: "https://x.com/koltukdunyasi",
  },
  {
    platform: "linkedin",
    key: "social_linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/koltukdunyasi",
  },
  {
    platform: "youtube",
    key: "social_youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@koltukdunyasi",
  },
]

export function parseSocialLinks(
  settings: Record<string, string | undefined>
): SocialLink[] {
  return SOCIAL_PLATFORMS.map(({ platform, key }) => ({
    platform,
    url: settings[key]?.trim() ?? "",
  }))
}
